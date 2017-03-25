//server.js

var express 	= require('express');
var app		= express();
var bodyParser 	= require('body-parser');
var path 	= require('path');

var logger	= require('morgan');
var session	= require('express-session');
var passport	= require('passport');
var cookieParser = require('cookie-parser');

require('./models/models');
var mongoose	= require('mongoose');
mongoose.connect('mongodb://localhost/dtwitter');

var index       = require('./routes/index');
var authenticate= require('./routes/authenticate')(passport);
var api		= require('./routes/api');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + /client/));
app.use(cookieParser());

app.use(logger('dev'));
app.use(session({
	secret: 'keyboard cat',
	resave: true,
        saveUninitialized: true,
	cookie: { maxAge : 3600000 }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/auth', authenticate);
app.use('/api', api);

var port = process.env.PORT || 8080;

//routes
var router = express.Router();

router.use(function(req, res, next) {
	console.log('starting');
	next();
});


var initPassport = require('./passport-init');
initPassport(passport);


//router.get('/', function(req, res) {
//	res.sendFile(path.join(__dirname + '/client/index.html'));
//});

//add more routes here

app.post('/adduser', function(req, res, next){
	res.redirect(307, '/auth/adduser');
});

app.post('/login', function(req, res, next){
	res.redirect(307, '/auth/login');
});

app.post('/logout', function(req, res, next){
	res.redirect(307, '/auth/logout');
});

app.post('/verify', function(req, res, next){
	res.send({status: 'OK'});
});

app.post('/additem', function(req, res, next){
	res.redirect(307, '/api/posts');
});

app.get('/item/:id', function(req, res, next){
	res.redirect('/api/posts/' + req.params.id);
});

app.post('/search', function(req, res, next){
	res.redirect(307, '/api/search');
});
//register routes
//app.use('/', router);

//start server
app.listen(port);
console.log('Running on port ' + port);
