var express = require("express");
var bodyParser = require('body-parser');
var apis = require("./apis.js")

var app = express();
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

var apis = require("./apis");

app.post('/', (req, res) => {
  let query = req.body.text;
  if(req.body.token != process.env.TOKEN){
    res.end();
    return;
  }

  if(query.startsWith("set")){
    let topic = query.substr(4);
    console.log(req.body);
    apis.setTopic({
      teamName: req.body.team_domain,
      channelName: req.body.channel_name,
      topic: topic,
      channelId: req.body.channel_id
    });
    
    res.json({
      response_type: 'in_channel',
      text: `Topic of channel set to \`${topic}\` by ${req.body.user_name}`
    });
    res.end();
  }
  else if(query.startsWith("show-all")){
    apis.queryAll(req.body.team_domain, (groups)=>{
      let reply = "Channel\t-\tTopic\n";
      groups.forEach((group)=>{
        reply += `${group["channel-name"]}\t-\t${group.topic}\n`
      });
      res.json({
        text: reply
      });
      res.end();
    });
  }
  else if(query.startsWith("find")){
    //TODO
    let topic = query.substr(5);
    apis.queryTopic(req.body.team_domain, topic, (groups) => {
      let reply = "Channel\t-\tTopic\n";
      groups.forEach((group)=>{
        reply += `${group["channel-name"]}\t-\t${group.topic}\n`
      });
      res.json({
        text: reply
    });
    res.end();
    });
  }
  else if(query.startsWith("add-to")){
    //TODO
    
    
    res.end();
  }
  else{
    //res.send("Princess is in another castle");
    res.json({
      "response_type": "ephemeral",
      "text": "How to use /studybot",
       "attachments":[
       {
          "text":`To set a topic, use '/studybot set [topicname]'. 
                \nTo get a list of all channels, use '/studybot show-all' 
                \nTo find a channel belonging to a particular topic, use '/studybot find [topicname]'
                \n/studybot add-to`
       }
   ]
    });
    res.end();
  }
});

app.get('/', (req, res) => {
  res.end("Hello World");
});

app.listen(process.env.PORT||"8080");