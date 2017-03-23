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
		.when('/adduser',{
                        templateUrl: 'adduser.html',
                        controller: 'authController'
                });
	$locationProvider.html5Mode(true);
});	

app.controller('mainController', function(postService, $scope, $rootScope){
	$scope.posts = postService.query();
	$scope.newPost = {created_by: '', text: '', created_at: ''};
	
	$scope.post = function() {
	  $scope.newPost.created_by = $rootScope.current_user;
	  $scope.newPost.created_at = Date.now();
	  postService.save($scope.newPost, function(){
	    $scope.posts = postService.query();
	    $scope.newPost = {created_by: '', text: '', created_at: ''};
	  });
	};
});

app.controller('authController', function($scope, $http, $rootScope, $location){
	$scope.user = {username: '', password: '', email: ''};
	$scope.error_message = '';
	
	$scope.login = function(){
		$http.post('/auth/login', $scope.user).success(function(data){
			if(data.state == 'success'){
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
                        if(data.state == 'success'){
                                $rootScope.authenticated = true;
                                $rootScope.current_user = data.user.username;
                                $location.path('/');
                        }else{
                                $scope.error_message = data.message;
                        }

                });

        };
});
