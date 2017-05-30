const express = require("express");
const bodyParser = require('body-parser');
const database = require("./database.js");
const asynclib = require("async");
const helpers = require("./helpers.js");

const app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));



app.post('/', (req, res) => {
  let query = req.body.text;

  if(req.body.token != process.env.TOKEN && !req.body.team_domain){
    res.end();
    return;
  }


  if(query.startsWith("set")){
    let topic = query.substr(4);
    console.log(req.body);
     // if channel exists in db, get token using getChannel, to prevent multiple user authentications for same channel.
    database.getChannel(req.body.team_domain, req.body.channel_id, (err, channel) => {
      console.log(err,channel);
      if(err === 404){
        // Channel doesnt exist in db. need to give link to add-to-slack
        database.getToken(req.body.team_id, req.body.user_id, (err, AUTH_TOKEN) => {
          // Hasn't authorised
          if(err === 404){
            // TODO MAKE THIS A BUTTON!
            res.send("You need to authorize us for seeing your private channels and invite people"); 
            res.end();
            return;
          }
          
          //Has authorised
          helpers.addToDB(AUTH_TOKEN, topic, req, res);
        })
        return;
      }
      
      // Channel already exists, use the token
      const AUTH_TOKEN = channel['auth-key'];
      helpers.addToDB(AUTH_TOKEN, topic, req, res);
    }); 
  }
  else if(query.startsWith("show-all")){
    database.queryAll(req.body.team_domain, (groups)=>{
      let reply = "Channel\t-\tTopic\n";
      groups.forEach((group)=>{
        reply += `${group["channel-name"]}\t-\t${group.topic}\n`
      });
      res.json({
        "response_type": "ephemeral",
      "text": "List of all channels",
       "attachments":[
         {
        text: reply
         }]
      });
      res.end();
    });
  }
  
  else if(query.startsWith("find")){
    let topic = query.substr(5);
    database.queryTopic(req.body.team_domain, topic, (groups) => {
      let reply = "Channel\t-\tTopic\n";
      if(groups.length == 0){
        res.json({
          text: "Topic named " + topic + " not found"
        });
        res.end();
        return;
      }
      //console.log(groups);
      groups.forEach((group)=>{
        reply += `${group["channel-name"]}\t-\t${group.topic}\n`
      });
      res.json({
        text: "Details of channels(s) belonging to the topic - " + topic + " :",
        attachments: [{
        text: reply
        }]
      });
      res.end();
    });
  }
  
  else if(query.startsWith("add-to")){
    let channelname = query.substr(7);
    
    //get channel_id and auth-key from db using getChannelInfo. 
     database.getChannelInfo(req.body.team_domain, channelname, (err, group) => {
      
      //add user to group, if group exists in the database
      if(group){
        helpers.slack('groups.invite', 
        {
          token: group['auth-key'],
          channel: group["channel-id"],
          user: req.body.user_id
        }).then((group) => {
          
          group = JSON.parse(group);
          
          if(group["already_in_group"]){
            res.json({text:"You are already in the group"});
          }
          else if (group.ok){
            res.json({text: "Successfully added you to the group :) "});
          }
          else {
            res.json({text: "Could not add you to the group :( Contact group members. "})
          }
          res.end();
        });
       }
       else{
         res.json({text: "Group not found in database."});
         res.end();
       }       
    });
  }
  else{
    res.json({
      "response_type": "ephemeral",
      "text": "How to use /studybot",
       "attachments":[
       {
          "text":`To set a topic, use '/studybot set [topicname]'. 
                \nTo get a list of all channels, use '/studybot show-all' 
                \nTo find a channel belonging to a particular topic, use '/studybot find [topicname]'
                \nTo add studybot to a private channel, use /studybot add-to [channelname]`
       }
    ]});
    res.end();
  }
});

app.get('/', (req, res) => {
  // Show a cute slack button
  res.end(`<a href="https://slack.com/oauth/authorize?&client_id=148122814833.188492009009
            &scope=commands,groups:write,groups:read,channels:write,channels:read,chat:write:bot,team:read">
            <img alt="Add to Slack" height="40" width="139" 
            src="https://platform.slack-edge.com/img/add_to_slack.png" 
            srcset="https://platform.slack-edge.com/img/add_to_slack.png 1x,
            https://platform.slack-edge.com/img/add_to_slack@2x.png 2x" />
          </a>`)
});

app.get('/auth', (req, res) => {
  // Prepare Data for Slack Auth
  let data = {
    client_id: process.env.SLACK_CLIENT_ID, 
    client_secret: process.env.SLACK_CLIENT_SECRET, 
    code: req.query.code 
  };
  
  // POST the data to slack access endpoint
  helpers.slack('oauth.access', data)
  .then((body) => {
    // Slack User Token
    let pBody = JSON.parse(body)
    let token = pBody.access_token;
    let user = pBody.user_id;
    let team_id = pBody.team_id;
    let team_name = pBody.team_name; 
    
    // Meanwhile store the {team -> token}
    database.storeToken(team_name, team_id, user, token);
    
    // Get Team Info for future reference to token
    helpers.slack('team.info', {token: token})
    .then((body) => {
      let team = JSON.parse(body).team.domain;

      // Take the User to their team's slack
      res.redirect(`http://${team}.slack.com`);
    }).catch(res.end);
  }).catch(res.end);
})


app.listen(process.env.PORT||"8080");