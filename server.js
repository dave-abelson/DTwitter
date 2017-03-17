//server.js

var express 	= require('express');
var app		= express();
var bodyParser 	= require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

//routes

var router = express.Router();

router.get('/', function(req, res) {
	res.json({message: 'Hooray! welcome to our api!'});
});

//add more routes here


//register routes
app.use('/api', router);

//start server
app.listen(port);
console.log('Running on port ' + port);
