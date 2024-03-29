var mongoose = require('mongoose'),
passport = require('passport'),
moment = require('./../public/javascripts/moment.js');
 

exports.index = function(req, res){
  res.render('index', {  title:"index", message:"Sorry, no games available"});
};
exports.load = function(req, res){
  
    res.header('content-type', 'application/json' );
   
    var game = new Game()
    game.getGameByID(req.params.id, function(err, result){
      if(err) {
        res.json({error:'unable to load game'});
        return;
      }

      jsonResponse = result;
      res.json(jsonResponse);

    });

    //res.render('load', {layout:false, message:jsonResponse})
     
 
 
};
exports.gameOver= function(req, res){
  var game = new Game()
 game.getGameByID(req.params.id, function(err, result){
      if(err) {
        res.json({error:'unable to find game'});
        return;
      }

      if(result.gameOver=="true") {
         // console.error("GameOver ... removing ");
              result.remove(); 
      }
      else {
        result.gameOver=true;
        result.save();

      }
      res.json({ result:"okay"});

    }); 

};
 

exports.myStats = function(req, res){
  var user = new User()
   user.findUserByID(req.params.id, function(err, result){
      if(err) {
        res.json({error:'unable to find user stats'});
        return;
      }
        var  results = { stats:result.stats, points:result.rank};
       res.json(results);

    });


};
exports.myavailablegames = function(req, res){
  var id = req.params.id;

  var game = new Game();
  var response = {"uid":id, "available":[]};
  game.getAvailableGamesByID(id, function(err, result){
        var myGame ={};
     if(err) {
      //  console.log('available: error ' + err);
        res.json({"error":"error loading game"});
     }
     else
     {
        //console.log('myavailableGames result ' + result[0].player1);
        //console.log('myavailableGames result ' + result[0]._id);
        
      
          //{"4333":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"343","name":"Joe Dangerous"}
        //console.log('myavailablegames count ' + result.length);
        for ( var i = 0;i<result.length;i++)
        {
          //console.log(result[i]._id);
          
          var gameData = JSON.parse(result[i].gameData); 

          myGame[result[i]._id] = {};
          var type = gameData.game.player1.gameSide;
          var faction = gameData.game.player1.faction;
          myGame[result[i]._id].player1= {};
          myGame[result[i]._id].player1["gametype"] = type
          myGame[result[i]._id].player1["faction"] =  faction
          myGame[result[i]._id].player1["id"]= result[i].player1;
          myGame[result[i]._id].player1["name"]=result[i].player1_nickname;
          myGame[result[i]._id].gameOver = result[i].gameOver;
          myGame[result[i]._id].player2 = {};

         if (gameData.game.player2 != null){
           type = gameData.game.player2.gameSide;
           faction = gameData.game.player2.faction;
         }
           else{
            type="";
          faction="";

          }
          myGame[result[i]._id].player2["gametype"] = type
          myGame[result[i]._id].player2["faction"] =  faction

          myGame[result[i]._id].player2["id"] = result[i].player2;
          myGame[result[i]._id].player2["name"] = result[i].player2_nickname;
          myGame[result[i]._id].turn = result[i].turn;
          myGame[result[i]._id].date = moment(result[i].date).format('dddd, MMMM Do YYYY, h:mm:ss a')
         // myGame[result[i]._id].gameData = result[i].gameData;
          
        // console.log('available results ' + result[i].id );

         // json = '{"' + result[i].id + '":{"player1":{"id":' + result[i].player1.id + ', "name":' + result[i].player1.nickname}, "player2":{"id":result[i].player2.id, "name":result[i].player2.nickname}, "turn":result[i].turn} };
         //console.log('json result ' + myGame); 
        }
        //console.log('MyAvailableGames  '  + myGame);
         
        res.json(myGame);
     }
    //console.log('available pre json response ' + response)


  });

  // var response = {"4333":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"343","name":"Joe Dangerous"},"turn":12},"2343":{"player1":{"id":"33","name":"Don Drago"},"player2":{"id":"544","name":"Tim Weaver"},"turn":4},"111":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"33","name":"Don Drago"},"turn":10},"543":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"33","name":"Don Drago"},"turn":3}};
  // res.json(response);

};
exports.mywaitinggames = function(req, res){
  var id = req.params.id;

  var game = new Game();
  var response = {"uid":id, "waiting":[]};
  game.getWaitingGamesByID(id, function(err, result){
        var myGame ={};
     if(err) {
      //  console.log('waiting: error ' + err);
        res.json({"error":"error loading game"});
     }
     else
     {
        //console.log('myavailableGames result ' + result[0].player1);
        //console.log('myavailableGames result ' + result[0]._id);
        
      
          //{"4333":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"343","name":"Joe Dangerous"}
        //console.log('myavailablegames count ' + result.length);
        for ( var i = 0;i<result.length;i++)
        {
          //console.log(result[i]._id);
          //console.log(result[i].turn);
          var future = new Date(result[i].date);
          future.setDate(future.getDate()+5);
          var current = new Date()
        //  console.log ('game date ' + result[i].date + '  current date ' + current + ' future date ' + future);
        //  console.log (' compare dates i ' + i + ' future ' + dates.compare(future, current));
          if (result[i].player1 !=null && result[i].player2!=null && dates.compare(future, current) == -1 ){

                 //a>b
                result[i].gameOver=true;
                result[i].nextPlayer = id;
                result[i].save(); 
             }else
              {
                  var gameData = JSON.parse(result[i].gameData);
                 // console.log('myavailablegames ' + JSON.stringify(gameData));
                  var type = gameData.game.player1.gameSide;
                  var faction = gameData.game.player1.faction;
                  myGame[result[i]._id] = {};

                  myGame[result[i]._id].player1= {};
                  myGame[result[i]._id].player1["id"]= result[i].player1;
                  myGame[result[i]._id].player1["name"]=result[i].player1_nickname;
                  myGame[result[i]._id].player2 = {};
                  myGame[result[i]._id].player1["gametype"] = type
                  myGame[result[i]._id].player1["faction"] =  faction
                  myGame[result[i]._id].player2["id"] = result[i].player2;
                  myGame[result[i]._id].player2["name"] = result[i].player2_nickname;
                      if (gameData.game.player2 != null){
                       type = gameData.game.player2.gameSide;
                       faction = gameData.game.player2.faction;
                     }
                       else{
                        type="";
                      faction="";

                      }
                  myGame[result[i]._id].player2["gametype"] = type
                  myGame[result[i]._id].player2["faction"] =  faction
                  myGame[result[i]._id].turn = result[i].turn;
                  myGame[result[i]._id].date = moment(result[i].date).format('dddd, MMMM Do YYYY, h:mm:ss a')
               // myGame[result[i]._id].gameData = result[i].gameData;
                
              // console.log('available results ' + result[i].id );

               // json = '{"' + result[i].id + '":{"player1":{"id":' + result[i].player1.id + ', "name":' + result[i].player1.nickname}, "player2":{"id":result[i].player2.id, "name":result[i].player2.nickname}, "turn":result[i].turn} };
               //console.log('json result ' + myGame); 
                }
 
          }
          
    
        //console.log('MyAvailableGames  '  + myGame);
         
        res.json(myGame);
     }
    //console.log('available pre json response ' + response)


  });

  // var response = {"4333":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"343","name":"Joe Dangerous"},"turn":12},"2343":{"player1":{"id":"33","name":"Don Drago"},"player2":{"id":"544","name":"Tim Weaver"},"turn":4},"111":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"33","name":"Don Drago"},"turn":10},"543":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"33","name":"Don Drago"},"turn":3}};
  // res.json(response);

};
exports.gamesWaitingUsers = function(req, res){
  var id = req.params.id;
  var game = new Game();
  var myGame ={};
  game.getGamesWaitingUsers(id, function(err, result){
     if(err) {
       // console.log('games waiting users error: ' + err);
     }
     else
     {

         //console.log('getGamesWaitingUsers: '  + result);
         /// gameID, player1 name, player2 name, type
          //{"4333":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"343","name":"Joe Dangerous"}
        var type;
        var faction;

        for ( var i = 0;i<result.length;i++)
        {
          var gameData = JSON.parse(result[i].gameData);
         // console.log('Game Data JSON: ' + result[i].gameData);
          myGame[result[i]._id] = {}; 
          myGame[result[i]._id].player1= {};
          if(result[i].player1 != null && result[i].player1.length>0){
           type = gameData.game.player1.gameSide;
           faction = gameData.game.player1.faction;
           console.log(' type' + type + ' ' + faction);
            myGame[result[i]._id].player1["id"]= result[i].player1;
            myGame[result[i]._id].player1["name"]= gameData.game.player1.playerName;
            myGame[result[i]._id].player1["faction"] = faction;
            myGame[result[i]._id].player1["gametype"] = type;
            myGame[result[i]._id].date = result[i].date

          }
          else{
            myGame[result[i]._id].player1["id"] = "";
            myGame[result[i]._id].player1["name"] = "-Open-";
            myGame[result[i]._id].date = result[i].date
             
          }

          myGame[result[i]._id].player2 = {};
          if(result[i].player2 != null && result[i].player2.length>0){
            type = gameData.game.player2.gameSide;
            faction = gameData.game.player2.faction;
            myGame[result[i]._id].player2["id"] = result[i].player2;
            myGame[result[i]._id].player2["name"] =  gameData.game.player2.playerName;
            myGame[result[i]._id].player2["faction"] = faction;
            myGame[result[i]._id].player2["gametype"] = type;

           // console.log('game ID ' + myGame[result[i]._id]);
           myGame[result[i]._id].date = result[i].date
          
          }
          else
          {
             myGame[result[i]._id].player2["id"] = "";
             myGame[result[i]._id].player2["name"] = "-Open-";
             myGame[result[i]._id].date = result[i].date
          }
          myGame[result[i]._id].gameType = type
          myGame[result[i]._id].date = moment(result[i].date).format('dddd, MMMM Do YYYY, h:mm:ss a')

          //console.log(myGame);
        // console.log('available results ' + result[i].id );

         // json = '{"' + result[i].id + '":{"player1":{"id":' + result[i].player1.id + ', "name":' + result[i].player1.nickname}, "player2":{"id":result[i].player2.id, "name":result[i].player2.nickname}, "turn":result[i].turn} };
         //console.log('json result ' + json); 

 
        }



        res.json(myGame); 

     }
    //console.log('available pre json response ' + myGame)


  });
  
  // var response = {"4333":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"343","name":"Joe Dangerous"},"turn":12},"2343":{"player1":{"id":"33","name":"Don Drago"},"player2":{"id":"544","name":"Tim Weaver"},"turn":4},"111":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"33","name":"Don Drago"},"turn":10},"543":{"player1":{"id":"544","name":"Tim Weaver"},"player2":{"id":"33","name":"Don Drago"},"turn":3}};
  // res.json(response);
 
};
exports.joinGame = function(req, res){
  console.log('joinGame ');
  var gameid = req.params.id;
  var player = JSON.parse(req.body.player);
  var game = new Game()
      game.getGameByID(gameid, function(err, result){
      console.log('joingame turn ' + result.turn);
      if(result.turn == 0){
        result.turn = 1;
        
      }
      else
      {
        res.json({"error":"game already taken"});
        return;
      }
    
       var gameInfo = JSON.parse(result.gameData);
 
      if(result.player2 ==null){
        result.player2 = player.playerid; 
        result.player2_nickname = player.playerName;
        gameInfo.game["player2"] = player;
      }

      result.gameData = JSON.stringify(gameInfo);
      result.save(); 

      res.json({"game":gameid});
  });

 
};
exports.available = function(req, res){
  // var id =req.params.id
  // var response =  { "uid":id, available: [ "123123","4132","23213","1231"]};
  // res.json(response); 

  var id =req.params.id;
  var game = new Game();
  var response = {"uid":id, "available":[]};
  game.getAvailableGamesByID(id, function(err, result){
     if(err) {
      //  console.log('available: error ' + err);
     }
     else
     {
        
        for ( var i = 0;i<result.length;i++)
        {
          //console.log('available results ' + result[i].id );
          response.available.push(result[i].id);
        }

         

     }
    //console.log('available pre json response ' + response)
    res.json(response);

  });


};
exports.waiting = function(req, res){

  var id =req.params.id
  var game = new Game()
 var response =  { "uid":id, "waiting":[ ]};
  game.getWaitingGamesByID(id, function(err, result){
    if(err) {
        //console.log('waiting: error ' + err);
     }
     else
     {
        
        for ( var i = 0;i<result.length;i++)
        {
        //  console.log('waiting results ' + result[i].id );
          response.waiting.push(result[i].id);
        }

    }
    res.json(response);

  });
 
 
};
exports.create = function(req, res){

  var id = req.params.id;
  var pData = JSON.parse(req.body.game);
  //console.log('player '  + req.body.player);
  //console.log('playerJSON' + JSON.stringify(pData))

  // var gameType = req.body.gameSide;
  // var nickname = req.body.nickname;

//  console.log('create new game called with id ' + id);
  var game = new Game();

  game.player1 = id;
  game.player1_nickname = pData.game.playerName;
   
  game.gameData =  JSON.stringify(pData);
  game.ownerID = id;
  game.turn = 0;
  game.victory = "";
  game.turnPackets="";
  game.nextPlayer ="";
  game.date = new Date()
  game.save();
  var gameInfo = { "player1":game.player1,"player1_nickname":game.player1_nickname, "player2":game.player2, "player2_nickname":game.player2_nickname, "id":game.id, "owner":id }

  var response = { "uid":id, "game":gameInfo}
  
  res.json(response);


};
exports.registerPost = function(req, res){
 //console.log(req);
  var user = new User();
  user.findByUserName(req.body.username, function(err, result){
    if(err){
      res.json({"error":"Sorry, unable to register you right now. Please try later"});
      return;
    }
     // console.log('registerPost user ' + result);
      if(result != false ){
        res.json({"error":"User name already exists"});
        return;
      }
      user.username = req.body.username;
      user.password = req.body.password;
      user.nickname = req.body.nickname;
      user.rank = req.body.rank;
      user.admin= 0;
      user.date = new Date();
      user.save();
      
      res.json({"userid": user.id});
 
  } );


};
exports.gameVersion = function(req, res){
  res.json({version:"1.2"});

}
exports.loginFailed = function(req, res){
  res.json({"error":"Sorry, unable to log you in."});
}
exports.loginSuccess = function(req,res){

  //console.log("LoginSuccess pre stringify");
  res.json(JSON.stringify(req.user));
}
exports.loginPost = function(req, res){

//console.log('loginPost ');
passport.authenticate('local', function(err, user, info) {
    if (err) { return res.json({"error":"Sorry, unable to log you in."}); }
    if (!user) { return res.json({"error":"Sorry, unable to log you in."});}
    req.logIn(user, function(err) {
      if (err) { return res.json({"error":"Sorry, unable to log you in."}); }
      return res.json(JSON.stringify(req.user));
    });
  })(req, res);

}
exports.updateGameChange = function(req, res){

 var gameid  = req.params.id;
  var gameData = req.body.changeInfo
  //console.log('updateGame post val ' + gameJSON);
  var game = new Game()
 
  game.getGameByID(gameid, function(err, results){
     if(err) {
          res.json({"id":gameid,"updated":false, error:err});
          return;
     }
     else
     {

        var gameJSON = JSON.parse(gameData);
        // console.log("WFT"   + results.changePackets !="");
        console.log(results.turn  + "    gameJSON.turn: " + gameJSON.turn + "   ");
        //console.log("post logging");
        if( results.turn == gameJSON.turn || results.changePackets !="" ){
          console.log("game turn already advanced or change packets not cleared");
          res.json({"id":gameid,"updated":false, error:"game turn already advanced or change packets not cleared"});
          return;
        }
        if(results.nextPlayer == gameJSON.nextPlayer) {
          console.log("Next Player already set to gameJSON next player. Ignoring turn packets");
          res.json({"id":gameid,"updated":false, error:"game turn already advanced next player has been set already"});
          return;

        }
       // console.log("UpdateGameChange:getGameByID "  + gameJSON);
        results.changePackets  = JSON.stringify(gameJSON.turnPackets);
        results.nextPlayer = gameJSON.nextPlayer;
        results.activePlayer = gameJSON.nextPlayer;
        results.date = new Date();
        results.turn = gameJSON.turn;
        results.player1_stats = JSON.stringify(gameJSON.player1_stats)
        results.player2_stats = JSON.stringify(gameJSON.player2_stats)
         
        results.save();

     }

     res.json({"id":gameid, "updated":true});
  } );




}
exports.updateGame = function(req, res){
  var gameid  = req.params.id;
  var gameData = req.body.gameInfo
  //console.log('updateGame post val ' + gameJSON);
  var game = new Game()


  game.getGameByID(gameid, function(err, results){
     if(err) {
         res.json({"id":gameid,"updated":false, error:err});
         return;
     }
     else
     {
        var gameJSON = JSON.parse(gameData);

        //console.log(" HERE "  + gameJSON.game.activePlayer);
        results.nextPlayer = gameJSON.game.activePlayer;
        results.turn = gameJSON.game.turn;
        console.log(gameJSON.game.player1.playerName);
        results.player1_nickname= gameJSON.game.player1.playerName;
        results.player2_nickname =gameJSON.game.player2.playerName;
        results.gameData = gameData; 
        results.changePackets = ''
        results.date == new Date();
        results.save(); 
     }

     res.json({"id":gameid, "saved":true});
  } );
  
}
exports.updateMyStats = function(req, res){
  
  var gameInfo = JSON.parse(req.body.gameInfo);
  var userID  = req.params.id;
  var userStats = gameInfo.stats;
  var turn = gameInfo.turn;
  var points = gameInfo.points;
  var gameID = gameInfo.gameID;
  //console.log('updateStats post val ' + points);
  //console.log('updateStats post val ' + userStats.shellsFired);
  var user = new User()
  
  user.updateStats(userID, userStats, points,  function(err, results){
     if(err) {
        console.log('error saving stats: error ' + err);
     }
     else
     {

        res.json(results);
     }
 
  } );
  
 

}
// Source: http://stackoverflow.com/questions/497790
var dates = {
    convert:function(d) {
        // Converts the date in d to a date-object. The input can be:
        //   a date object: returned without modification
        //  an array      : Interpreted as [year,month,day]. NOTE: month is 0-11.
        //   a number     : Interpreted as number of milliseconds
        //                  since 1 Jan 1970 (a timestamp) 
        //   a string     : Any format supported by the javascript engine, like
        //                  "YYYY/MM/DD", "MM/DD/YYYY", "Jan 31 2009" etc.
        //  an object     : Interpreted as an object with year, month and date
        //                  attributes.  **NOTE** month is 0-11.
        return (
            d.constructor === Date ? d :
            d.constructor === Array ? new Date(d[0],d[1],d[2]) :
            d.constructor === Number ? new Date(d) :
            d.constructor === String ? new Date(d) :
            typeof d === "object" ? new Date(d.year,d.month,d.date) :
            NaN
        );
    },
    compare:function(a,b) {
        // Compare two dates (could be of any type supported by the convert
        // function above) and returns:
        //  -1 : if a < b
        //   0 : if a = b
        //   1 : if a > b
        // NaN : if a or b is an illegal date
        // NOTE: The code inside isFinite does an assignment (=).
        return (
            isFinite(a=this.convert(a).valueOf()) &&
            isFinite(b=this.convert(b).valueOf()) ?
            (a>b)-(a<b) :
            NaN
        );
    },
    inRange:function(d,start,end) {
        // Checks if date in d is between dates in start and end.
        // Returns a boolean or NaN:
        //    true  : if d is between start and end (inclusive)
        //    false : if d is before start or after end
        //    NaN   : if one or more of the dates is illegal.
        // NOTE: The code inside isFinite does an assignment (=).
       return (
            isFinite(d=this.convert(d).valueOf()) &&
            isFinite(start=this.convert(start).valueOf()) &&
            isFinite(end=this.convert(end).valueOf()) ?
            start <= d && d <= end :
            NaN
        );
    }
}
 