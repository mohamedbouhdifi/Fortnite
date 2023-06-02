var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var childFavSkinSchema = new Schema({
	skinTitle: String,
	description: String,
	image: String,
	imageProfile: String,
	pickaxeImg: String,
	pickaxeName: String,
	emoteImg: String,
	emoteName: String,
	notes: String,
	wins: Number,
	losses: Number,
}),

	childBlackListSkinSchema = new Schema({
		skinTitle: String,
		description: String,
		imageProfile: String,
		image: String,
		reason: String,
	}),

	childFortniteSchema = new Schema({
		Favskins: [childFavSkinSchema],
		BlacklistSkins: [childBlackListSkinSchema],

	}),

	userSchema = new Schema({
		unique_id: Number,
		username: String,
		email: String,
		password: String,
		passwordConf: String,
		ProfilePic: String,
		Fortnite: childFortniteSchema,
	}),

	User = mongoose.model('User', userSchema);


module.exports = User;
