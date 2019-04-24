
//** REST Web API functions **//

function getAllBlogs ($http) {
    return $http.get('/api/blogs');
}

function getBlogById($http, blogid) {
    return $http.get('/api/blogs/' + blogid);
}

function updateBlogById($http, blogid, data) {
    return $http.put('api/blogs/' + blogid, data);
}

function addBlog($http, data) {
    return $http.post('api/blogs/', data);
}

function deleteBlog($http, blogid) {
    return $http.delete('/api/blogs/'+ blogid);
}

var app = angular.module('blogApp', ['ngRoute']);

//** Router Provider **//

app.config(function($routeProvider) {
    $routeProvider
        .when('/', {
	    templateUrl: 'home.html',
	    controller: 'homeController',
	    controllerAs: 'vm'
	})
    
        .when('/list', {
	    templateUrl: 'list.html',
	    controller: 'listController',
	    controllerAs: 'vm'
	})
    
        .when('/add', {
	    templateUrl: 'add.html',
	    controller: 'addController',
	    controllerAs: 'vm'
	})
    
        .when('/edit/:blogid', {
	    templateUrl: 'edit.html',
	    controller: 'editController',
	    controllerAs: 'vm'
	})

        .when('/remove/:blogid', {
	    templateUrl: 'remove.html',
	    controller: 'removeController',
	    controllerAs: 'vm'
	})

	.otherwise({redirectTo: '/'});
});

//** Controllers **//

app.controller('homeController', function homeController() {
    var vm = this;
    vm.homeHeader = "Leandro Martinez blog website";
    vm.homeText = "Welcome to my blog website";
});

app.controller('listController', function listController($http) {
    var vm = this;
    vm.listHeader = "Blog List";
    getAllBlogs($http)
	.success(function(data) {
	    vm.blogs = data;
	})
});

app.controller('editController', function editController($scope, $http, $routeParams, $location){
    var vm = this;
    var id = $routeParams.blogid;

    getBlogById($http, id)
	.success(function(data) {
	    vm.blogs = data;
	})
    vm.submit = function() {
	var data = vm.blogs;
	data.blogtitle = userForm.blogtitle.value;
	data.blogtext = userForm.blogtext.value;
	updateBlogById($http, id, data)
	    .success(function(data) {
		console.log("Updated");
		$location.path('/list');
	    })
    }
});

/*app.controller('removeController', function removeController($http, $routeParams, $location) {
    var vm = this;
    var id = $routeParams.blogid;
    console.log ("var");
    getBlogById($http, id)
	.success(function(data) {
	    console.log("success");
	    vm.blogs = data; 
	})
    vm.sumbit = function() {
	var data = {};
	deleteBlog($http, id)
	    .success(function(data) {
		console.log("Deleted");
		$location.path('/list');
	    })
    }
    });*/

app.controller('removeController', function removeController($http, $routeParams, $location){

    var vm = this;
    var id = $routeParams.blogid;
    getBlogById($http, id)
	.success(function(data) {
	    console.log("success");
	    vm.blogs = data;
	})
    vm.submit = function() {
	deleteBlog($http, id)
	    .success(function(data) {
		console.log("deleted");
		$location.path('/list');
	    })
    }
});
	

app.controller('addController', function addController($http, $location){
    var vm = this;
    console.log(vm.blogs);
    vm.blogs = {};
    vm.submit = function(){
	var data = vm.blogs;
	data.blogtitle = userForm.blogtitle.value;
	data.blogtext = userForm.blogtext.value;
	addBlog($http, data)
	    .success(function(data){
		console.log("Added");
		$location.path('/list');
	    })
    }
});
