//server.js

var express 	= require('express');
var app		= express();
var bodyParser 	= require('body-parser');
var path 	= require('path');

var logger	= require('morgan');
var session	= require('express-session');
var passport	= require('passport');

require('./models/models');
var mongoose	= require('mongoose');
mongoose.connect('mongodb://localhost/dtwitter');


var index       = require('./routes/index');
var authenticate= require('./routes/authenticate')(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + /client/));
app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(session({
	secret: 'keyboard cat',
	resave: true,
        saveUninitialized: true
}));

app.use('/', index);
app.use('/auth', authenticate);

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


//register routes
//app.use('/', router);

//start server
app.listen(port);
console.log('Running on port ' + port);
