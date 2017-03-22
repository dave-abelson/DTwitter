//server.js

var express 	= require('express');
var app		= express();
var bodyParser 	= require('body-parser');
var path 	= require('path');

var index 	= require('./routes/index');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname + /client/));

app.use('/', index);

var port = process.env.PORT || 8080;

//routes

var router = express.Router();

router.use(function(req, res, next) {
	console.log('starting');
	next();
});

router.get('/', function(req, res) {
	res.sendFile(path.join(__dirname + '/client/index.html'));
});

//add more routes here

router.post('/adduser', function(req, res) {
	res.json({message: 'Add user'});
});

	


//register routes
app.use('/', router);

//start server
app.listen(port);
console.log('Running on port ' + port);
