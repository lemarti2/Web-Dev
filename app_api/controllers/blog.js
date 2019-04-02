var mongoose = require('mongoose');
var blog = mongoose.model('blog');

var sendJsonResponse = function(res, status, content){
	res.status(status);
	res.json(content);

//POST a new blog

module.exports.blogCreate = function (req, res) {
  console.log(req.body);
  Blog.create({
	blogTitle: req.body.blogtitle,
	blogText: req.body.blogtext
      },
function(err, blog) {
	if (err) {
	   console.log(err);
	   sendJSONresponse(res, 400, err);
	}
	else {
	   console.log(blog);
	   sendJSONresponse(res, 201, blog);
	}
       }
     );
   };

//GET list of all blogs

module.exports.blogListAll = function(req, res) {
  console.log('Getting blog list');
  Blog
      .find()
      .exec(function(err, results) {
	if (!results){
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
	sendJSONresponse(res, 200, buildBlogListAll(req, res, results));
      });
};

var buildBlogListAll = function(req, res, results) {
  var blog = [];
  results.forEach(function(obj) {
    blog.push({
      blogtitle: obj.blogtitle,
      blogtext: obj.blogtext,
      _id: obj._id
    });
  });
  return blog;
};

//GET blog by ID

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

//PUT Update blog with ID

    module.exports.blogUpdateOne = function(req, res) {
	console.log("Updating a blog entry: " + req.params.blogid);
	console.log(req.body);
	Blog
	    .findOneandUpdate(
		{ _id: req.params.blogid },
		{ $set: {"blogtitle": req.body.blogtitle, "blogtext": req.body.blogtext}}
		function(err, response) {
		    if (err) {
			sendJSONresponse(res, 400, err);
		    } else {
			sendJSONresponse(res, 201, response);
		    }
		});
    };

//DELETE Delete blog with ID

    module.exports.blogDeleteOne = function(req, res) {
	console.log("Deleting blog entry with id of " + req.params.blogid);
	console.log(req.body);
	Blog
	    .findByIdAndRemove(req.params.blogid)
	    .exec (
		function(err) {
		    if (err) {
			sendJSONresponse(res, 404, err);
		    } else {
			sendJSONresponse(res, 204, null);
		    }
		});
    };
