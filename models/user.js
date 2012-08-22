var mongoose = require('mongoose'),
 bcrypt  = require('bcrypt'); 
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: String,
  salt: { type:String, required:true },
  hash: { type:String, required: true},

  userid: String,
  nickname: String,
  rank: Number,
  admin: String,
  stats: String, 
  date: Date
});
UserSchema.method('getCount', function(test){
			var count=0; 
			for (i=0;i<test.length;i++)
			{
				console.log(i + ' ' + test[i]);
				if(test[i].trim().length>0){
					count++;
				}
			}
			return count;

});
UserSchema.method('updateStats', function(userID, stats, rankPts, callback){
	User.findOne({_id:userID},function(err, users){
		//console.log('inside findUserById ' + users);
		if(err)
			return callback(err);
		if(!users)
			return callback(null,null,  false);
		console.error('updateStats inside USER '  + stats.spotted.bomber);

		if (users.rank ==null) { users.rank = 0; }
		users.rank = users.rank+rankPts;
		if(users.stats == null || users.stats=='' ){
			
			var test = stats.spotted.bomber.trim().split(' '); 
			var count = users.getCount(test)
			stats.spotted.bomber  = count;
			test = stats.spotted.cargo.trim().split(' ');
			count = users.getCount(test)
			 stats.spotted.cargo  = count;
			test = stats.spotted.destroyer.trim().split(' ');
			count = users.getCount(test)
			 stats.spotted.destroyer  = count;
			test = stats.spotted.transport.trim().split(' ');
			count = users.getCount(test)
			 stats.spotted.transport  = count;
			test = stats.spotted.submarine.trim().split(' ');
			count = users.getCount(test)
			 stats.spotted.submarine =count;

			
			users.stats = JSON.stringify(stats);
			users.save();
			return callback(null, users.stats);
		}
		
		//var stats = JSON.parse(stats);
		var us = JSON.parse(users.stats);
		//"stats":{"shellsFired":9,"minesReleased":0,
		//"spotted":{"bomber":"","cargo":"","destroyer":"","transport":"","submarine":"  21  19  20  18"},
		//"cargoLost":0,"tonnageSunk":0,"torpedosHit":0,"sonar":0,"torpedosFired":0,
		//"tonnage":{"bomber":0,"cargo":0,"destroyer":0,"transport":0,"submarine":20000},
		//"shipsLost":0,"shipsSunk":0,"safeCargo":0,"sunk":{"bomber":0,"cargo":0,"destroyer":0,"transport":0,"submarine":4},
		//"minesHit":0,"depthChargesHit":3,"shellsHit":24,"troopsLost":0,
		//"lost":{"bomber":0,"cargo":0,"destroyer":2,"transport":0,"submarine":0},
		//"planesShotDown":0,"planesLost":0,"dive":0,"depthChargesReleased":3,
		//"safeTroops":0,"surface":0} 
		us.shellsFired+= stats.shellsFired;
		us.shellsHit+= stats.shellsHit;
		var test = stats.spotted.bomber.trim().split(' '); 
		var count = users.getCount(test)
		us.spotted.bomber += count;
		test = stats.spotted.cargo.trim().split(' ');
		var count = users.getCount(test)
		us.spotted.cargo += count;
		test = stats.spotted.destroyer.trim().split(' ');
		var count = users.getCount(test)
		us.spotted.destroyer +=count;
		test = stats.spotted.transport.trim().split(' ');
		var count = users.getCount(test)
		us.spotted.transport += count;
		test = stats.spotted.submarine.trim().split(' ');
		us.spotted.submarine +=count;
		us.cargoLost += stats.cargoLost;
		us.tonnageSunk += stats.tonnageSunk;
		us.torpedosHit += stats.torpedosHit;
		us.sonar += stats.sonar;
		us.torpedosFired += stats.torpedosFired;
		us.tonnage.bomber += stats.tonnage.bomber;
		us.tonnage.cargo +=stats.tonnage.cargo;
		us.tonnage.destroyer+=stats.tonnage.destroyer;
		us.tonnage.transport+=stats.tonnage.transport;
		us.tonnage.submarine += stats.tonnage.submarine;
		us.shipsLost += stats.shipsLost;
		us.shipsSunk += stats.shipsSunk;
		us.safeCargo += stats.safeCargo;
		us.sunk.bomber += stats.sunk.bomber;
		us.sunk.cargo += stats.sunk.cargo;
		us.sunk.destroyer += stats.sunk.destroyer;
		us.sunk.transport += stats.sunk.transport;
		us.sunk.submarine += stats.sunk.submarine;
		us.lost.bomber += stats.lost.bomber;
		us.lost.cargo += stats.lost.cargo;
		us.lost.destroyer+=stats.lost.destroyer;
		us.lost.transport += stats.lost.transport;
		us.lost.submarine += stats.lost.submarine;
		us.dive += stats.dive;
		us.depthChargesReleased += stats.depthChargesReleased;
		us.safeTroops += stats.safeTroops;
		us.surface += stats.surface;

		 
	 
		users.stats = JSON.stringify(us);

		users.save();
 


		//console.log('did not find any games' + games == null);
		return callback(null, users);

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