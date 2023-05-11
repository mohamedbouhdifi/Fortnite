var mongoose = require('mongoose');
var Schema = mongoose.Schema;

childFavSkinSchema = new Schema({
	skinTitle: String,
	description: String,
	image: String,
	pickaxe: String,
	emote: String,
	notes: String,
	wins: Number,
	loses: Number,
}),

childBlackListSkinSchema = new Schema({
	skinTitle: String,
	description: String,
	image: String,
	reason: String,
}),

childFortniteSchema = new Schema({	
	Favskins: [childFavSkinSchema],
	BlacklistSkins: [childBlackListSkinSchema],
	ProfilePic: String,
}),

userSchema = new Schema( {
	unique_id: Number,
	username: String,
	email: String,
	password: String,
	passwordConf: String,
	Fortnite: childFortniteSchema,
}),
User = mongoose.model('User', userSchema);

module.exports = User;