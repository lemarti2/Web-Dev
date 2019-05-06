var mongoose = require('mongoose'); 
var blogSchema = new mongoose.Schema({
    blogtitle: String,
    blogtext: String,
    userName: String,
    userEmail: String,
    createdon: {
	type: Date,
	"default": Date.now
    }
});
mongoose.model('blog', blogSchema)
