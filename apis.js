var MongoClient = require('mongodb').MongoClient;
var nlp = require('compromise')

/* Takes the group and adds to database
 * input: {object} : data as fields
 * {
 *   teamName : {string} : name of slack team
 *   channelName : {string} : name of channel aka study-group
 *   topic : {string} : topic for that study-group
 *   channelId : {string} : Id of channel
 * }
 */
exports.setTopic = (input) => {
  // Format data for mongodb
  let data = {
    "slack-team": input.teamName,
    "channel-name": input.channelName,
    "topic": input.topic,
    "channel-id": input.channelId
  }
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('study-groups').updateOne({
        "slack-team": input.teamName,
        "channel-name": input.channelName
      }, data, {upsert:true, w: 1}, function(err, result){
      if(err != null){
        console.log("Error happened :(");
      }
      db.close();  
    })
  });
}

/* Takes the topic and finds the groups related to it
 * teamName : {string} : name of slack team
 * topic : {string} : topic to query
 * callback : {function (array)} : handle the query result
 */
exports.queryTopic = (teamName, topic, callback) => {
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('study-groups').createIndex(
      {
        "topic":"text"
      });
    db.collection('study-groups').find({
      "slack-team": teamName,
      $text: {
        $search : topic 
      }
    }).toArray((err, docs) => {
      if(err == null){
        callback(docs);
      }
      else{
        console.log(err);
      }
      db.close();
    });
    
  })
}

/* Returns all groups in the slack-team
 * teamName : {string} : name of slack team
 * callback : {function (array)} : handle the query result
 */
exports.queryAll = (teamName, callback) => {
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('study-groups').find({
      "slack-team": teamName,
    }).toArray((err, docs) => {
      if(err == null){
        callback(docs);
      }
      db.close();
    });
  });
}