var express 	= require('express');
var router 	= express.Router();
var mongoose	= require('mongoose');
var Post	= mongoose.model('Post');
var User	= mongoose.model('User');

var currentuser;

function isAuthenticated(req, res, next){
	currentuser = req.user;
	if (req.method == "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}
	if (req.method == 'DELETE'){
		return next();
	}
	return res.redirect(307, '/login');
};

router.use('/posts', isAuthenticated);
router.use('/follow', isAuthenticated);

router.route('/posts')
	.post(function(req, res){
		var post = new Post();
		post.content = req.body.content;
		post.username = currentuser.username;
		post.id = mongoose.Types.ObjectId();
		post.timestamp = Date.now();
		post.status = 'OK';
		console.log('Name ' + post.username);	
		post.save(function(err, post){
			if (err){
				return res.send(500, err);
			}
			return res.json(post);
		});
	})
	
	.get(function(req, res) {
		Post.find(function(err, posts){
			if (err){
				return res.send(500, err);
			}
			return res.send(200, posts);
		});

	});

router.route('/posts/:id')
	.get(function(req, res){
		Post.findOne({id: req.params.id}, function(err, post){
			if(err){
				res.send(err);
			}
			res.send({status: 'OK', item: post});
		});
	})
	
	.put(function(req, res){
		Post.findById(req.params.id, function(err, post){
			if(err)
				res.send(err);

			post.username = req.body.username;
			post.content = req.body.content;

			post.save(function(err, post){
				if(err)
					res.send(err);

				res.json(post);
			});
		});
	})

	.delete(function(req, res){
		Post.remove({
			id: req.params.id
		}, function(err) {
			if(err){
				res.send({status: 'error'});
			}
			res.send({status: 'OK'});
		});
	});

router.route('/user/:username')
	.get(function(req, res){
		User.findOne({username: req.params.username}, function(err, user){
			if (err){
				res.send({status: 'error', message: err});
			}
			res.send({status: 'OK', user: {email: user.email, followers: user.followers.length, following: user.following.length}});
		});
	});

router.route('/follow')
	.post(function(req, res){
		if (req.body.follow == 'false'){
			bool = false;
		}else{
			bool = true;
		}

		User.findOne({username: req.body.username}, function(err, user){
			if(err){
				res.send({status: 'error', message: err});
			}
			if(bool == true){
				user.followers.push(currentuser.username);
			}else{
				var index = user.followers.indexOf();
				user.followers.splice();
			}
						
		});

		User.findOne({username: currentuser.username}, function(err, user){
			if(err){
                                res.send({status: 'error', message: err});
                        }
                });	
		res.send({status: 'OK'});
	});

router.route('/search')
	.post(function(req, res){
		var limit = 25;
		if (req.body.limit != null && req.body.limit <= 100){
			limit = req.body.limit;	
		}
		var time = new Date(req.body.timestamp);
		Post
		.find({'timestamp': {'$lte': time}})
		//.find()
		.sort({date: -1})
		.limit(limit)
		.exec(function(err, posts){
                        if(err){
                                res.send({status: 'error', message: err});
                        }else{
                        	res.send({status: 'OK', items: posts});
			}
                });

		//.find({'timestamp': {$lte: time}})
		//.sort({'timestamp': -1})
		//.limit(limit)
		//.exec(function(err, posts){
		//	if(err){
		//		res.send(err);
		//	}
		//	res.send({status: 'OK', items: posts});
		//});	
	});

module.exports = router;
