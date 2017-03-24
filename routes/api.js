var express 	= require('express');
var router 	= express.Router();
var mongoose	= require('mongoose');
var Post	= mongoose.model('Post');

function isAuthenticated(req, res, next){
	if (req.method === "GET"){
		return next();
	}
	if (req.isAuthenticated()){
		return next();
	}

	return res.redirect('/login');
};

router.use('/posts', isAuthenticated);

router.route('/posts')
	.post(function(req, res){
		var post = new Post();
		post.content = req.body.content;
		post.username = req.body.username;
		post.id = mongoose.Types.ObjectId();
		post.timestamp = req.body.timestamp
	
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
		Post.findById(req.params.id, function(){
			if(err){
				res.send(err);
			}
			post.username = req.body.username;
			post.content = req.body.content;
			//might have to add timestamp

			post.save(function(err, post){
				if(err){
					res.send(err);
				}
				res.json(post);
			});
		});
	})

	.delete(function(req, res){
		Post.remove({
			id: req.params.id
		}, function(err) {
			if(err){
				res.send(err);
			}
			res.json("deleted :(");
		});
	});

module.exports = router;
