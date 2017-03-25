var express = require('express');
var router = express.Router();

module.exports = function(passport){

	//sends successful login state back to angular
	router.get('/success', function(req, res){
		console.log("route " + req.user);
		res.send({status: 'OK', user: req.user ? req.user: null});
	});

	//sends failure login state back to angular
	router.get('/failure', function(req, res){
		res.send({status: 'error', error: 'Invalid username or password', user: null});
	});

	//log in
	router.post('/login', passport.authenticate('login', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));

	//sign up
	router.post('/adduser', passport.authenticate('adduser', {
		successRedirect: '/auth/success',
		failureRedirect: '/auth/failure'
	}));
/*	
	//verify
	router.post('/verify', passport.authenticate('verify', {
		successRedirect: '/auth/success',
                failureRedirect: '/auth/failure'
	}));
*/
	//log out
	router.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;

}
