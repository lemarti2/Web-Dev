
//** REST Web API functions **//

function getAllBlogs ($http) {
    return $http.get('/api/blogs');
}

function getBlogById($http, blogid) {
    return $http.get('/api/blogs/' + blogid);
}

function updateBlogById($http, blogid, data, authentication) {
    return $http.put('api/blogs/' + blogid, data, { headers: {Authorization: 'Bearer '+ 
							      authentication.getToken()}});
}

function addBlog($http, data, authentication) {
    return $http.post('api/blogs/', data, { headers: {Authorization: 'Bearer '+ 
						      authentication.getToken()}});
}

function deleteBlog($http, blogid, authentication) {
    return $http.delete('/api/blogs/'+ blogid, { headers: {Authorization: 'Bearer '+ 
							   authentication.getToken()}});
}

var app = angular.module('blogApp', ['ngRoute']);

//*** Authentication Service and Methods **
app.service('authentication', authentication);
authentication.$inject = ['$window', '$http'];
function authentication ($window, $http) {
    
    var saveToken = function (token) {
        $window.localStorage['blog-token'] = token;
    };
                                       
    var getToken = function () {
        return $window.localStorage['blog-token'];
    };
        
    var register = function(user) {
        console.log('Registering user ' + user.email + ' ' + user.password);
        return $http.post('/api/register', user).success(function(data){
            saveToken(data.token);
        });
    };
     
    var login = function(user) {
        console.log('Attempting to login user ' + user.email + ' ' + user.password);
        return $http.post('/api/login', user).success(function(data) {
            saveToken(data.token);
        });
    };
        
    var logout = function() {
        $window.localStorage.removeItem('blog-token');
    };
        
    var isLoggedIn = function() {
        var token = getToken();

        if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
        } else {
            return false;
        }
    };

    var currentUser = function() {
        if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
		email : payload.email,
		name : payload.name
            };
        }
    };

    return {
        saveToken : saveToken,
        getToken : getToken,
        register : register,
        login : login,
        logout : logout,
        isLoggedIn : isLoggedIn,
        currentUser : currentUser
    };
}

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

	.when('/login', {
	    templateUrl: 'login.html',
	    controller: 'LoginController',
	    controllerAs: 'vm'
	})

	.when('/register', {
	    templateUrl: 'register.html',
	    controller: 'RegisterController',
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

app.controller('listController',[ '$http', 'authentication', function listController($http, authentication) {
    console.log("test");
    var vm = this;
    vm.listHeader = "Blog List";
    vm.isLoggedIn = function(){
	return authentication.isLoggedIn();
    }
    getAllBlogs($http)
	.success(function(data) {
	    vm.blogs = data;
	    console.log(data);
	    console.log("successful");
	})
}]);

app.controller('editController',[ '$http', '$routeParams', '$location','authentication', function editController( $http, $routeParams, $location, authentication){
    var vm = this;
    var id = $routeParams.blogid;
    vm.isLoggedIn = function() {
	return authentication.isLoggedIn();
    }
		   
    getBlogById($http, id)
	.success(function(data) {
	    console.log("success");
	    vm.blogs = data;	    
	})
    vm.submit = function() {
	var data = vm.blogs;
	data.blogtitle = userForm.blogtitle.value;
	data.blogtext = userForm.blogtext.value;
	updateBlogById($http, id, data, authentication)
	    .success(function(data) {
		console.log("Updated");
		$location.path('/list').replace();
	    })
    }
	       }]);


app.controller('removeController',[ '$http', '$routeParams', '$location', 'authentication', function removeController($http, $routeParams, $location, authentication){
    
    var vm = this;
    var id = $routeParams.blogid;
    vm.isLoggedIn = function(){
	return authentication.isLoggedIn();
		   }
    getBlogById($http, id)
	.success(function(data) {
	    console.log("success");
	    vm.blogs = data;
	})
    vm.submit = function() {
	deleteBlog($http, id, authentication)
	    .success(function(data) {
		console.log("deleted");
		$location.path('/list').replace();
	    })
    }
	       }]);
	

app.controller('addController',['$http', '$location', 'authentication', function addController($http, $location, authentication){
    var vm = this;
    console.log(vm.blogs);
    vm.blogs = {};
    vm.isLoggedIn = function(){
	return authentication.isLoggedIn();
		   }
    
    vm.submit = function(){
	var data = vm.blogs;
	data.blogtitle = userForm.blogtitle.value;
	data.blogtext = userForm.blogtext.value;
	addBlog($http, data, authentication)
	    .success(function(data){
		console.log("Added");
		$location.path('/list').replace();
	    })
    }
	       }]);

app.controller('LoginController', [ 
    '$http', '$location', 'authentication', function LoginController($http, $location, authentication) {
	var vm = this;
	
	vm.pageHeader = {
	    title: 'Sign in to Blogger'
	};
	vm.credentials = {
	    email : "",
	    password : ""
	};
	vm.returnPage = $location.search().page || '/';
	vm.onSubmit = function () {
	    vm.formError = "";
	    if (!vm.credentials.email || !vm.credentials.password) {
		vm.formError = "All fields required, please try again";
		return false;
	    } else {
		vm.doLogin();
	    }
	};
	vm.doLogin = function() {
	    console.log("ATTEMPTING LOGIN");
	    vm.formError = "";
	    authentication
		.login(vm.credentials)
		.error(function(err){
		    var obj = err;
		    vm.formError = obj.message;
		})
		.then(function(){
		    $location.search('page', null);
		    $location.path(vm.returnPage);
		});
	};
    }]);

app.controller('RegisterController', [ '$http', '$location', 'authentication', function RegisterController($http, $location, authentication) {
    var vm = this;
    vm.pageHeader = {
	title: 'Create a new Blog account'
    };
    
    vm.credentials = {
	name : "",
	email : "",
	password : ""
    };
    
    vm.returnPage = $location.search().page || '/';
    
    vm.onSubmit = function () {
		       vm.formError = "";
	if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
			   vm.formError = "All fields required, please try again";
	    return false;
	} else {
	    vm.doRegister();
	}
    };
		   vm.doRegister = function() {
		       vm.formError = "";
		       authentication
			   .register(vm.credentials)
			   .error(function(err){
			       vm.formError = "Error registering. Try again with a different email address."
			       //vm.formError = err;
			   })
			   .then(function(){
			       $location.search('page', null);
			       $location.path(vm.returnPage);
			   });
		   };
}]);
