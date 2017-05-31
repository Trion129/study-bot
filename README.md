# Slack Study Bot
A Slack bot that allows management of private study groups in a slack team using slash commands.

### Usage

```
/studybot set-topic [topic]
```
Sets the topic of the private channel and adds it to database

```
/studybot show-all
```
Shows all the private study groups in the team

```
/studybot find [topic]
```
Finds the study-group with the given topic. Shows a list of creator and 2 most active members of the study-group. Users can DM any of them to join the study-group.

```
/studybot add-to [channel]
```
Directly enter the study-group
