var request = require('request'); 
var apiOptions = {
    server : "http://localhost"
};
var _showError = function (req, res, status) {
    var title, content;
    if (status === 404) {
	title = "404, page not found";
	content = "Welp, looks like we can't find this page, try again later.";
    } else if (status === 500) {
	title = "500, internal server error";
	content = "There's a problem with our server, try again later.";
    } else {
	title = status + ", something's gone wrong";
	content = "It seems as something has gone wrong.";
    }
    res.status(status);
    res.render('generic-text', {
	title : title,
	content : content
    });
};
/* GET blogs list */ module.exports.list = function(req, res){
    var requestOptions, path;
    path = '/api/blogs';
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {},
        qs : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderListPage(req, res, body);
        }
    );
};
/* Render the blog list page */ var renderListPage = function(req, res, 
responseBody){
    res.render('list', {
        title: 'Blog List',
        blogs: responseBody
    });
};
/*Get add page*/ module.exports.add = function (req, res) {
    res.render('add', { title: "Add Blogs"});
};
 /* Blog Add Post */ module.exports.addBlog = function(req, res){
    var requestOptions, path, postdata;
    path = '/api/blogs/';
    postdata = {
        blogtitle: req.body.blogtitle,
        blogtext: req.body.blogtext
    };
    requestOptions = {
	url : apiOptions.server + path,
	method : "POST",
	json : postdata
    };

    request(
	requestOptions,
	function(err, response, body) {
            if (response.statusCode === 201) {
		res.redirect('/list');
            } else {
		_showError(req, res, response.statusCode);
            }
	}
    );
};
/* Book Edit */ module.exports.edit = function(req, res) {
    var requestOptions, path;
    console.log(req.params);
    path = "/api/blogs/" + req.params.blogid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            renderEditPage(req, res, body);
        }
    );
};
/* Render the blog edit page */ var renderEditPage = function(req, res, 
responseBody){
    res.render('edit', {
        title: 'Edit Blog',
        blog: responseBody
    });
};
/* Blog Edit Post */ module.exports.editBlog = function(req, res){
    var requestOptions, path, postdata;
    var id = req.params.blogid;
    console.log(req.params);
    path = '/api/blogs/' + id;
    postdata = {
        blogtitle: req.body.blogtitle,
        blogtext: req.body.blogtext
    };
    requestOptions = {
        url : apiOptions.server + path,
        method : "PUT",
        json : postdata
    };
    request(
	requestOptions,
        function(err, response, body) {
            if (response.statusCode === 201) {
                res.redirect('/list');
            } else {
		_showError(req, res, response.statusCode);
            }
        }
    );
};
/* Blog Delete */
 module.exports.remove = function(req, res) {
    var requestOptions, path;
    path = "/api/blogs/" + req.params.blogid;
    requestOptions = {
        url : apiOptions.server + path,
        method : "GET",
        json : {}
    };
    request(
	requestOptions,
        function(err, response, body) {
            renderDeletePage(req, res, body);
        }
    );
};
/* Render the blook delete page */ var renderDeletePage = function(req, res, 
responseBody){
    res.render('remove', {
        title: 'Blog Delete',
        blog: responseBody
    });
};
/* Book Delete Post */ module.exports.removeBlog = function(req, res){
    var requestOptions, path, postdata;
    var id = req.params.blogid;
    path = '/api/blogs/' + id;
    requestOptions = {
	url : apiOptions.server + path,
        method : "DELETE",
        json : {}
    };
    request(
        requestOptions,
        function(err, response, body) {
            if (response.statusCode === 204) {
                res.redirect('/list');
            } else {
                _showError(req, res, response.statusCode);
            }
        }
    );
};
