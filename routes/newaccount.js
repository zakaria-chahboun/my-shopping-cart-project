var express = require('express');
var router = express.Router();
var User = require('../models/users'); // load Users Model from Models folder

// get newAccount page 
router.get('/',checkConnection,checkAdmin, function(req, res, next) {
  res.render('newaccount', { title: 'Welcome' });
});

router.post('/',function(req,res,next) {
  req.assert('userName','invalid user name [minimum 4 - maximum 30]').isLength({min:4,max:30});
  req.assert('password1','invalid password [minimum 6]').isLength({min:6});
  req.assert('password1','invalid password (Replay)').equals(req.body.password2);
  req.assert('email','invalid email format').isEmail();

  var userName = req.body.userName; // from view
  var userEmail = req.body.email; // from view
  var userPassword = req.body.password1; // from view

  // logical errors
  var err = req.validationErrors();
  if(err)
  {
    res.render('newaccount.pug',{msgerr : err,u:userName,e:userEmail});
  }
  else // search user in database
  {

  	User.findOne({ email: userEmail }, function(err, data) {
  	if(err) throw err;
  	if(data)
  	{
  		res.render('newaccount.pug',{msgerr_db: 'Email Alredy Exist!',u:userName,e:userEmail});
  	}
  	else
  	{
  		var newUser = new User({
  			name: userName,
  			email: userEmail,
  			password: userPassword
  		});
  		newUser.save(function (err) {
  			if(err) throw err;
  			req.session.user = {id:newUser._id,name:newUser.name}; // create User sesion
  			res.redirect('/profile');
  		});
  	}
 	});
 }
});

// check if user alredy connect
function checkConnection(req,res,next) {
	if(req.session.user){
		res.redirect('/');
	}else{
		next();
	}
}

// ::: check admin :::
function checkAdmin(req,res,next) {
  if(req.session.admin)
  {
    res.redirect('/admin_manage');
  }else{
    next();
  }
}

module.exports = router;