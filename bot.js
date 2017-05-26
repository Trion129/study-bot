var apis = require('./apis.js')

var RtmClient = require('@slack/client').RtmClient;
var RTM_EVENTS = require('@slack/client').RTM_EVENTS;
var CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
var bot_token = process.env.SLACK_BOT_TOKEN || '';
var rtm = new RtmClient(bot_token);
var bot = {};

/**
    Subscribe to authentication event. If you receive this event your bot has been successfully authenticated.
    Couple of useful information can be found in the callback data. In particular your bot's ID and NAME.
*/
rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, (rtmStartData) => {
    let self = rtmStartData.self;
    bot.id = self.id;
    bot.name = self.name
    console.log(`Logged in as ${bot.name} of team ${rtmStartData.team.name}`);
});

/**
    Subscribe to all messages in all channels your bot is invited to and direct messages sent to your bot.
    Note that this does not include checking whether a user send a message to your bot.
    For instance it does to check if the message mentions your bot's name.
*/
rtm.on(RTM_EVENTS.MESSAGE, (message) => {
    console.log(`Received message from ${message.user} in ${message.channel}`);
    console.log(message.text);
    rtm.sendMessage("Hello <@" + message.user + ">!", message.channel);
    if(message.text.startswith('studybot set')) {
             let topic = message.text.substr(14);
             rtm.sendMessage("You added a new topic "  + message.user, message.channel);
        }
});

rtm.start();

/*get a list of all public channels

var WebClient = require('@slack/client').WebClient;

var web = new WebClient(bot_token);

web.channels.list(function(err, info) {
   if (err) {
       console.log('Error:', err);
   } else {
       for(var i in info.channels) {
           //console.log(info);
           console.log('Public Channel name: ' + info.channels[i].name + ' , Topic: ' + info.channels[i].topic.value + ' , Purpose: ' + info.channels[i].purpose.value);
       }
   }
});

*/