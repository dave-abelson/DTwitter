var app = angular.module('dtwitterApp', ['ngRoute', 'ngResource']).run(function($rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';

	$rootScope.logout = function(){
    	$http.get('auth/logout');
    	$rootScope.authenticated = false;
    	$rootScope.current_user = '';
	};	
});

app.config(function($routeProvider, $locationProvider){
	$routeProvider

		.when('/',{
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		.when('/login',{
                        templateUrl: 'login.html',
                        controller: 'authController'
                })
		.when('/verify', {
			templateUrl: 'verify.html',
			controller: 'authController'
		})
		.when('/adduser',{
                        templateUrl: 'adduser.html',
                        controller: 'authController'
                });
	$locationProvider.html5Mode(true);
});	

app.factory('postService', function($resource){
	return $resource('/api/posts/:id');

});

app.controller('mainController', function(postService, $scope, $rootScope){
	$scope.posts = postService.query();
	$scope.newPost = {id: '', username: '', content: '', timestamp: '' };
	
	$scope.post = function() {
	  $scope.newPost.username = $rootScope.current_user;
	  $scope.newPost.timestamp = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {id: '', username: '', content: '', timestamp: ''};
	  });
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: '', email: ''};
	$scope.error_message = '';
	
	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.status == 'OK'){
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');
			}else{
				$scope.error_message = data.message;
			}
		
		});

	};

	$scope.register = function(){
                $http.post('/auth/adduser', $scope.user).success(function(data){
                        if(data.status == 'OK'){
				$rootScope.authenticated = true;
                                $rootScope.current_user = data.user.username;
                                $location.path('/');
                        }else{
                                $scope.error_message = data.error;
                        }

                });

        };

	$scope.verify = function(){
		$http.post('/auth/verify', $scope.user).success(function(data){
			if(data.status == 'OK'){
				console.log("HERE");
				$rootScope.authenticated = true;
				$rootScope.current_user = data.user.username;
				$location.path('/');	
			}else{
				$scope.error_message = data.error;
			}
		});
	};
});
