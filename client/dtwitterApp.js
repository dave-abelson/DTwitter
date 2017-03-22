var app = angular.module('dtwitterApp', ['ngRoute', 'ngResource']).run(function($rootScope) {
	$rootScope.authenticated = false;
	$rootScope.current_user = '';
	
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
