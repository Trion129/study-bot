var MongoClient = require('mongodb').MongoClient;

/* Takes the group and adds to database
 * input: {object} : data as fields
 * {
 *   teamName : {string} : name of slack team
 *   channelName : {string} : name of channel aka study-group
 *   topic : {string} : topic for that study-group
 *   creator: {string} : Id of creator
 * }
 */
exports.setTopic = (input) => {
  let data = {
    "slack-team": input.teamName,
    "channel-name": input.channelName,
    "channel-id": input.channelId,
    "topic": input.topic,
    "auth-key": input.authKey
  }
  
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('study-groups').updateOne({
        "slack-team": input.teamName,
        "channel-name": input.channelName
      }, data, {upsert:true, w: 1}, (err, result) => {
      
      if(err != null){
        console.log("Error happened :(", err);
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
      "topic": {
        $regex : topic,
        $options: "$i"
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
      else{
        console.log(err);
      }
      
      db.close();
    });
  });
}

/* Add the access token to database
 * teamName : {string} : Name of team
 * access_token : {string} : Code to get access for team
 */
exports.storeToken = (teamName, teamid, userid, access_token) => {
  let data = {
    "slack-team": teamName,
    "team-id": teamid,
    "user-id": userid,
    "token": access_token
  }
  
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('slack_user_tokens').updateOne({
        "slack-team": teamName
      }, data, {upsert:true, w: 1}, (err, result)=>{
      
      if(err != null){
        console.log("Error happened :(", err);
      }
      
      db.close();  
    })
  });
}

/* Get the token from database given the team domain
 * team_id : {string} : Team domain name
 * user_id : {string} : User Id to find
 * callback : {function (err, string)} : Function to handle the token
 */
exports.getToken = (team_id, user_id, callback) => {
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('slack_user_tokens').findOne({
      "team-id": team_id,
      "user-id": user_id
    }).then((data)=>{
      if(!data){
        callback(404, null);
        return;
      }
      callback(null, data.token);
    })
  });  
}

/* Gets the specified channel data
 * team_id : {string} : Team domain name
 * channel_id : {string} : Channel id to find 
 * callback : {function(err, data)} : function to handle the channel data
 */
exports.getChannel = (team_name, channel_id, callback) => {
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('study-groups').findOne({
      "slack-team": team_name,
      "channel-id": channel_id
    }
    ).then((data)=>{
      if(!data){
        callback(404 , null);
        return;
      }
      callback(null, data);
    });
  });
}

/* Gets the specified channel data from study-groups collection, i.e. :
   * channel-id
   * auth-key
*/

exports.getChannelInfo = (team_name, channel_name, callback) => {
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('study-groups').findOne({
      "slack-team": team_name,
      "channel-name": channel_name
    }).then((data) => {
      if(!data){
        callback(404, null);
      }
      else{
        callback(null,data);
      }
      
      db.close();
    });
  });
}

/* Check team exists
 * team_id : {string} : Team domain name
 * callback : {function (err, string)} : Function to handle the token
 */
exports.checkTeam = (team_id, callback) => {
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('slack_user_tokens').findOne({
      "team-id": team_id
    }).then((data)=>{
      if(!data){
        callback(404, null);
        return;
      }
      callback(null, data.token);
    })
  });  
}

exports.removeChannel = (input) => {
  let data = {
    "slack-team": input.teamName,
    "channel-id": input.channelId
  }
  
  MongoClient.connect(process.env.MONGO_URL, (err, db) => {
    db.collection('study-groups').updateOne({
        "slack-team": input.teamName,
        "channel-name": input.channelName
      }, data, {upsert:true, w: 1}, (err, result) => {
      
      if(err != null){
        console.log("Error happened :(", err);
      }
      
      db.close();  
    })
  });
}