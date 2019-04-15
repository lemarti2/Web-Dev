var mongoose = require('mongoose'); 
var blogSchema = new mongoose.Schema({
    blogtitle: String,
    blogtext: String,
    createdon: {
	type: Date,
	"default": Date.now
    }
});
mongoose.model('blog', blogSchema)
