var mongoose = require('mongoose'),
 Schema = mongoose.Schema;

var GameSchema = new Schema({
  player1: { type: String, index:true},
  player1_nickname: String,
  player1_rank: String,
  player1_faction:String,
  player2: { type: String, index:true},
  player2_nickname: String,
  player2_rank:String,
  player2_faction:String,
  ownerID:{ type: String, index:true},
  turn: Number,
  victory: String,
  nextPlayer: String,
  gameData: String,
  changePackets: String, 
  player1_stats: String,
  player2_stats: String,
  gameOver: String,
  date: Date
});
GameSchema.method('getGameByID', function(id, callback){
    console.log('getGameByID');

	var query = Game.findOne({ _id:id});
	//query.where('nextPlayer').eq(id);
	query.exec(function(err, games){
		//console.log('inside getbyid ' + games);
		if(err)
			return callback(err);
		if(!games)
			return callback(null, false);
		 
			//console.log('did not find any games' + games == null);
		return callback(null, games);

		});
});
GameSchema.method('getAvailableGamesByID', function(id, callback){

	var query = Game.find({ nextPlayer:id});
	//query.where('nextPlayer').eq(id);
	query.exec(function(err, games){
		//console.log('inside available ' + games);
		if(err)
			return callback(err);
		if(!games)
			return callback(null, false);
		 
			//console.log('did not find any games' + games == null);
			return callback(null, games);

		});
	});

GameSchema.method('getWaitingGamesByID', function(id, callback){
    console.log('getWaitingGamesByID ' + id );
	//var query = Game.find({});
	//query.where({player2:id}).or({ownerID:id});
	// query.where('nextPlayer').ne(id);
	// query.where('nextPlayer').ne('');
	// query.where({player2:id});
	// query.where({player1:id});
	var query = Game.find({})
	query.or([{player2:id}, {ownerID:id}]);
	query.where('nextPlayer').ne(id);
	query.where({'nextPlayer': ''});
	//query.sort('turn',1); TODO - sort doesn't work
	query.exec(function(err, games){
		//console.log('inside ' + games);
		if(err)
			return callback(err);
		if(!games)
			return callback(null, false);
		 
			//console.log('did not find any games' + games == null);
			return callback(null, games);

		});
	});
GameSchema.method('getGamesWaitingUsers', function(id, callback){

	var query = Game.find({});
	query.where('turn', 0);
	query.where('player1').ne(id);
	query.where('player2').ne(id);
	query.exec(function(err, games){
		//console.log('inside ' + games);
		if(err)
			return callback(err);
		if(!games)
			return callback(null, false);
		 
			//console.log('did not find any games' + games == null);
			return callback(null, games);
 
		});
	});
module.exports =mongoose.model('Game', GameSchema);

/*
{"turnPackets":"null","game":{"player1":{"torpLowYield":0,"mines":0,"depthCharges":0,"cargoships":[],"playerNo":1,
"destroyedUnits":[],"shellsHighYield":0,"units":[],"playerName":"tim_aa","airSonar":0,"depthChargesLowYield":0,
"shellsLowYield":0,"stats":{"safeCargo":0,"sonar":0,"mines":0,"torpedos":0,"safeTroops":0,"surfaces":0,"dives":0,
"shells":0},"submarines":[{"id":2,"unitType":"submarine","name":"Nautilus Class"},{"id":3,"unitType":"submarine",
"name":"Nautilus Class"},{"id":4,"unitType":"submarine","name":"Nautilus Class"},{"id":5,"unitType":"submarine",
"name":"Nautilus Class"}],"destroyers":[],"aircraft":[],"transports":[],"depthChargesHighYield":0,
"torpHighYield":0,"playerid":"4fe883f5df80381e4a00001a"},"player2":{"torpLowYield":0,"mines":0,"depthCharges":0,
"cargoships":[{"id":6,"unitType":"cargo","name":"Carry-On Class"},{"id":7,"unitType":"cargo",
"name":"Carry-On Class"},{"id":8,"unitType":"cargo","name":"Carry-On Class"},{"id":9,"unitType":"cargo",
"name":"Carry-On Class"}],"playerNo":2,"destroyedUnits":[],"shellsHighYield":0,
"units":[{"hasHighYieldTorpedos":false,"depthCharges":10,"hitPoints":4,"id":21,"unitType":"destroyer",
"hasHighYieldShells":false,"visual":{"y":240,"x":944,"rotation":270,"direction":{"direction":3}},"shells":10,
"moves":0,"damage":0},{"hasHighYieldTorpedos":false,"depthCharges":10,"hitPoints":4,"id":19,
"unitType":"destroyer","hasHighYieldShells":false,"visual":{"y":464,"x":976,"rotation":270,
"direction":{"direction":3}},"shells":10,"moves":0,"damage":0}],"playerName":"tim_b","airSonar":0,
"depthChargesLowYield":0,"shellsLowYield":0,"stats":{"safeCargo":0,"sonar":0,"mines":0,"torpedos":0,
"safeTroops":0,"surfaces":0,"dives":0,"shells":0},"submarines":[{"id":22,"unitType":"submarine","name":
"Nautilus Class"},{"id":23,"unitType":"submarine","name":"Nautilus Class"},{"id":24,"unitType":"submarine",
"name":"Nautilus Class"},{"id":25,"unitType":"submarine","name":"Nautilus Class"}],"destroyers":[{"id":15,
"unitType":"destroyer"},{"id":17,"unitType":"destroyer"}],"aircraft":[{"id":10,"unitType":"aircraft","name":
"Sparrow Class"},{"id":11,"unitType":"aircraft","name":"Sparrow Class"},{"id":12,"unitType":"aircraft",
"name":"Sparrow Class"},{"id":13,"unitType":"aircraft","name":"Sparrow Class"}],"transports":[],
"depthChargesHighYield":false,"torpHighYield":0,"playerid":"4fe885ab4d9a7f384a000008"},
"gameid":"4fea01185ac127b80a00026c","turn":1,"weather":[],"victory":"","activePlayer":"4fe883f5df80381e4a00001a"}}
*/