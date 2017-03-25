var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var postSchema = new mongoose.Schema({
	id: String,		
	username: String,
	content: String,	
	timestamp: {type: Date, default: Date.now},
	status: String
});

var userSchema = new mongoose.Schema({
	username: String,
	password: String, 
	email: String,
	created_at: {type: Date, default: Date.now}
})


mongoose.model('Post', postSchema);
mongoose.model('User', userSchema);
