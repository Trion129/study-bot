const request = require('request-promise');
const database = require('./database.js');

const slack = (api, data={}, method='POST') => {
  return request({
        method : 'POST',
        uri: `https://slack.com/api/${api}`,
        form: data,
        headers: {
           'content-type': 'application/x-www-form-urlencoded' 
        }
      });
}

const addToDB = (AUTH_TOKEN, topic, req, res) => {
  slack('groups.info', {
    token: AUTH_TOKEN,
    channel: req.body.channel_id
  })
  .then((data) => {
    data = JSON.parse(data);
    if(!data.ok){
      res.end('The channel is public, already easy to join via channel list');
    }
    database.setTopic({
      teamName: req.body.team_domain,
      channelName: data.group.name,
      channelId: req.body.channel_id,
      topic: topic,
      authKey: AUTH_TOKEN
    });

    res.json({
      response_type: 'in_channel',
      text: `Channel is about topic \`${topic}\` - set by ${req.body.user_name}`
    });
    res.end();
  });
}

exports.slack = slack;
exports.addToDB = addToDB;