var express = require('express');
var router = express.Router();
var mongoose=require('mongoose');
var Post=mongoose.model('Post');
var Comment=mongoose.model('Comment');
var User=mongoose.model('User');
var passport=require('passport');
var jwt=require('express-jwt');
var auth=jwt({secret:'SECRET', userProperty:'payload'});
//var nev=require('email-verification')(mongoose);
//var nodemailer=require('nodemailer'); 
/*nev.generateTempUserModel(User,function(err,tempUserModel){
	if(err){
		console.log(err);
		return;
	}
	console.log('generated temp model');
});*/

router.post('/register', function(req,res,next){
	if(!req.body.username || !req.body.password || !req.body.email){
		return res.status(400).json({message:'Please fill out all fields'});
	}

	User.count({username: req.body.username}, function (err, count){ 
    	if(count>0){
        	return res.status(400).json({message:'User name already taken'});
    	}
	});

	User.count({email: req.body.email}, function (err, count){ 
    	if(count>0){
        	return res.status(400).json({message:'Only one account per email address'});
    	}
	});

	var user=new User();

	console.log('created new user');

	user.username=req.body.username;
	user.email=req.body.email;
	user.setPassword(req.body.password);

	console.log('retrieved user info');

	/*nev.createTempUser(user,function(err,existingPersistentUser,newTempUser){
		if(err){return res.status(404).json({message:'Creating temp user failed'});}
		if(existingPersistentUser){
			return res.status(400).json({message:'User exists'});
		}
		if(newTempUser){
			var URL=newTempUser[nev.options.URLFieldName];
			nev.sendVerificationEmail(email,URL,function(err,info){
				if(err){return res.status(404).json({message:'error sending mail'});}
				res.json({message:'Email Sent!'});
			});
		}
		else
		{
			return res.status(400).json({message:'There was a problem'});
		}	
	});

	console.log('created temp');*/
	user.save(function(err)
	{
		if(err){return next(err);}
		return res.json({token: user.generateJWT()});
	});
});

/*router.get('/email-verification/:URL',function(req,res){
	var url=
});*/

router.post('/login',function(req,res,next){
	if(!req.body.username||!req.body.password){
		return res.status(400).json({message: 'Please fill out all fields'});
	}

	passport.authenticate('local',function(err,user,info){
		if(err){return next(err);}

		if(user){
			return res.json({token: user.generateJWT()});
		}
		else{
			return res.status(401).json(info);
		}
	})(req,res,next);
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/posts',function(req,res,next){
	Post.find(function(err,posts){
		if(err){return next(err);}
		res.json(posts);
	});
});

router.post('/posts',auth,function(req,res,next){
	var post=new Post(req.body);
	post.author=req.payload.username;
	post.save(function(err,post){
		if(err){return next(err);}
		res.json(post);
	});
});

router.param('post',function(req,res,next,id){
	var query=Post.findById(id);
	query.exec(function(err,post){
		if(err){return next(err);}
		if(!post){return next(new Error("can't find post"));}

		req.post=post;
		return next();
	});
});

router.param('comment',function(req,res,next,id){
	var query=Comment.findById(id);
	query.exec(function(err,comment){
		if(err){return next(err);}
		if(!comment){return next(new Error("can't find comment"));}

		req.comment=comment;
		return next();
	});
});

router.get('/posts/:post',function(req,res,next){
	req.post.populate('comments',function(err,post){
		res.json(req.post);
	});
});

router.put('/posts/:post/upvote',auth,function(req,res,next){
	req.post.upvote(function(err,post){
		if(err){return next(err);}
		res.json(post);
	});
});

router.put('/posts/:post/downvote',auth,function(req,res,next){
	req.post.downvote(function(err,post){
		if(err){return next(err);}
		res.json(post);
	});
});

//added comments
router.post('/posts/:post/comments',auth,function(req,res,next){
	var comment=new Comment(req.body);
	comment.post=req.post;
	comment.author=req.payload.username;
	comment.save(function(err,comment){
		if(err){return next(err);}

		req.post.comments.push(comment);
		req.post.save(function(err,post){
			if(err){return next(err);}
			res.json(comment);
		});
	});
});

router.put('/posts/:post/comments/:comment/upvote',auth,function(req,res,next){
	req.comment.upvote(function(err,comment){
		if(err){return next(err);}
		res.json(comment);
	});
});

router.put('/posts/:post/comments/:comment/downvote',auth,function(req,res,next){
	req.comment.downvote(function(err,comment){
		if(err){return next(err);}
		res.json(comment);
	});
});

module.exports = router;
