#Minimal slack bot boilerplate code

The purpose of this code is mainly educational. 
It was created as part of a guide, but can be used to start developing your own bot.
Also, I wanted to have a running example of a bot build on slack-node-sdk,
 rather than BotKit. 

**What this code does?**

- listens to bot authentication event
- gets the bot ID and NAME
- listens to all messages (from channels and direct messages)
- replies to every message

The code was influenced by [official Slack guide](https://slackapi.github.io/node-slack-sdk/bots.html), 
but it fixes its oversights (the missing RTM_EVENTS.MESSAGE import). 

##Prerequisites

- [node](https://nodejs.org/en/)
- [heroku toolbelt](https://devcenter.heroku.com/articles/heroku-cli)
- Slack account
- Bot token

##Setup

- create a custom bot (I'll cover it in my article. For now, follow [Slack Guide](https://my.slack.com/services/new/bot))
- copy your bot's TOKEN and paste it into the .env file

##More information and continuation

Since this code was generated as part of my preparation to an article
you will find more information on [GreatDayToCode blog](http://greatdaytocode.com)
and by following me on Twitter [@greatdaytocode](https://twitter.com/greatdaytocode)

I will supplement this readme with more details when the article is ready.

Feel free to fork and reuse this code!