#Minimal slack bot boilerplate code

The purpose of this code is mainly educational. 
It was created as part of a guide, but can be used to start developing your own bot.
Also, I wanted to have a running example of a bot build on slack-node-sdk,
 rather than BotKit. 

**What this code does?**

- listens to bot authentication event
- gets the bot ID and NAME
- listens to all messages (from channels and direct messages)
- replies to ev