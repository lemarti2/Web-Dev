var mongoose = require('mongoose'); 
var Blog = mongoose.model('blog'); 

var sendJSONresponse = function(res, status, content) {
    res.status(status);
    res.json(content);
}
//********************************************************************************
 /* GET a list of all blogs */ 
module.exports.blogList = function(req, res) {
    console.log('Getting blogs list');
  Blog
	.find()
	.exec(function(err, results) {
            if (!results) {
		sendJSONresponse(res, 404, {
		    "message": "no blogs found"
		});
		return;
            } else if (err) {
		console.log(err);
		sendJSONresponse(res, 404, err);
		return;
            }
            console.log(results);
            sendJSONresponse(res, 200, buildBlogList(req, res, results));
	});
};
var buildBlogList = function(req, res, results) {
    var blogs = [];
    results.forEach(function(obj) {
	blogs.push({
	    blogtitle: obj.blogtitle,
	    blogtext: obj.blogtext,
	    _id: obj._id,
	    userName: obj.userName,
	    userEmail: obj.userEmail,
	    upVote: obj.upVote,
	    createdon: obj.createdon
	    });
    });
    return blogs;
};
 
/* POST a new blog */ /* /api/blogs */

module.exports.blogCreate = function(req, res) {
    console.log(req.body);
  Blog
	.create({
	    blogtitle: req.body.blogtitle,
	    blogtext: req.body.blogtext,
	    userName: req.body.Username,
	    userEmail: req.body.userEmail,
	    upVote: req.body.upVote
	}, function(err, blog) {
	    if (err) {
		console.log(err);
		sendJSONresponse(res, 400, err);
	    } else {
		console.log(blog);
		sendJSONresponse(res, 201, blog);
	    }
	}
	       );
};

module.exports.blogReadOne = function(req, res) {
    console.log('Finding blog details', req.params);
    if (req.params && req.params.blogid) {
    Blog
	    .findById(req.params.blogid)
	    .exec(function(err, blog) {
		if (!blog) {
		    sendJSONresponse(res, 404, {
			"message": "blogid not found"
		    });
		    return;
		} else if (err) {
		    console.log(err);
		    sendJSONresponse(res, 404, err);
		    return;
		}
		console.log(blog);
		sendJSONresponse(res, 200, blog);
	    });
    } else {
	console.log('No blogid specified');
	sendJSONresponse(res, 404, {
	    "message": "No blogid in request"
	});
    }
};
module.exports.blogUpdateOne = function(req, res) {
    console.log("Updating blog: " + req.params.blogid);
    console.log(req.body);
    Blog
	.findOneAndUpdate(
	    {_id: req.params.blogid},
	    {$set: {"upVote": req.body.upVote, "blogtitle": req.body.blogtitle, "blogtext": req.body.blogtext}},
	    function (err, response) {
		if (err){
		    sendJSONresponse(res, 400, err);
		}else{
		    sendJSONresponse(res, 201, response);
		}
	    });
    
};

module.exports.blogDeleteOne = function(req, res) {
    console.log("Deleting book entry with id of ", req.params.blogid);
    console.log(req.body);
    Blog
        .findByIdAndRemove(req.params.blogid)
        .exec (
            function(err, response) {
                if (err) {
                    sendJSONresponse(res, 404, err);
                } else {
                    sendJSONresponse(res, 204, null);
                }
            }
        );
};
