var mongoose = require('mongoose'),
 bcrypt  = require('bcrypt'); 
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  salt: { type:String, required:true },
  hash: { type:String, required: true},

  userid: String,
  nickname: String,
  rank:String,
  admin: String,
  stats: String, 
  date: Date
});
UserSchema.method('updateStats', function(userID, stats, rankPts, callback){
	User.findOne({_id:userID},function(err, users){
		//console.log('inside findUserById ' + users);
		if(err)
			return callback(err);
		if(!users)
			return callback(null,null,  false);
		

		users.rank = users.rank+rankPts;
		if(users.stats == "" ){
			users.stats = stats;
			users.save();
			return callback(null, users.stats);
		}
		var stats = JSON.parse(stats);
		var us = JSON.parse(users.stats);
///{ shellsFired= 0, shellsHit =0, dive=0, surface=0, torpedosFired=0, 
	//torpedosHit = 0, minesReleased =0,minesHit= 0, safeCargo = 0, safeTroops = 0,
	// cargoLost=0, troopsLost = 0,sonar=0, depthChargesReleased=0,depthChargesHit = 0,
	//shipsLost=0,  tonnageSunk =0, shipsSunk=0, planesShotDown = 0}
		us.shellsFired+= stats.shellsFired;
		us.shellsHit+= stats.shellsFired;
		us.dive+=stats.dive;
		us.surface+=stats.surface;
		us.torpedosFired+=stats.torpedosFired;
		us.torpedosHit += stats.torpedosHit;
		us.minesReleased+=stats.minesReleased;
		us.minesHit += stats.minesHit;
		us.safeCargo+=stats.safeCargo;
		us.safeTroops+=stats.safeTroops;
		us.cargoLost+= stats.cargoLost;
		us.troopsLost += stats.troopsLost;
		us.sonar += stats.sonar;
		us.depthChargesReleased += stats.depthChargesReleased;
		us.depthChargesHit += stats.depthChargesHit;
		us.shipsLost += stats.shipsLost;
		us.tonnageSunk+=stats.tonnageSunk;
		us.shipsSunk += stats.shipsSunk;
		us.planesShotdown += stats.planesShotDown;

		users.stats = JSON.stringify(us);
		users.save();
 


		//console.log('did not find any games' + games == null);
		return callback(null, gameid, users);

		});
});



 
UserSchema.method('findUserByID', function(userID, callback){
    // console.log('findUserByID supplied game id ' + gameid)
	User.findOne({_id:userID},function(err, users){
		//console.log('inside findUserById ' + users);
		if(err)
			return callback(err);
		if(!users)
			return callback(null, false);
		 
			//console.log('did not find any games' + games == null);
			return callback(null, users);

		});
	});

UserSchema.method('findByUserName', function(username, callback){

	User.findOne({username:username},function(err, users){
		//console.log('inside findUserById ' + users);
		if(err)
			return callback(err);
		if(!users)
			return callback(null,  false);
		 
			//console.log('did not find any games' + games == null);
			return callback(null, users);

		}); 

});

UserSchema.virtual('password').get(function(){
	console.log('virtual password get ');
	return this._password;
}).set(function(password){
		console.log('virtual password set ' + password);
	this._password = password;
	var salt = this.salt = bcrypt.genSaltSync(10);
	console.log(salt);
	this.hash = bcrypt.hashSync(password, salt);

});
UserSchema.method('checkPassword', function(password, callback){
	console.log('check pass password get ');
	bcrypt.compare(password, this.hash, callback);

});
UserSchema.static('authenticate', function(username, password, callback){
	console.log('user schema authenticate ');
	this.findOne({username:username}, function(err, user){
		console.log(user);
		if(err)
			return callback(err);
		if(!user)
			return callback(null, false);
		user.checkPassword(password, function(err, passwordCorrect){
			if(err)
				return callback(err);
			if(!passwordCorrect){
				console.log('password is incorrect');
				return callback(null, false);

			}
			console.log('password is correct');
			return callback(null, user);

		});
	});
});

module.exports =mongoose.model('User', UserSchema);