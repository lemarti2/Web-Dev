var mongoose = require('mongoose'); 
var blogSchema = new mongoose.Schema({
    blogtitle: String,
    blogtext: String,
    userName: String,
    userEmail: String,
    upVote: {type: Number, "default": 0},
    createdon: {
	type: Date,
	"default": Date.now
    }
});
mongoose.model('blog', blogSchema)
