var express = require('express');
var router = express.Router();
var User = require('../models/users'); // load Users Model from Models folder


// came from app (/login) and set here (/login/) or any thing like (/login/ff)
router.get('/',checkConnection,checkAdmin,function(req, res, next) {
  res.render('login', { title: 'login' });
});

router.post('/',function(req,res,next) {
  req.assert('pass','invalid password [minimum 6]').isLength({min:6});
  req.assert('email','invalid email [...@...]').isEmail();
  // logical errors
  var err = req.validationErrors();
  if(err)
  {
    res.render('login.pug',{msgerr : err});
  }
  else // search user in database
  {
  	var userEmail = req.body.email; // from view
  	var userPassword = req.body.pass; // from view

  	User.findOne({ email: userEmail }, function(err, data) {
  	if(err) throw err;
  	if(data)
  	{
  		var userName = data.name;
		  var userID = data._id;
  		User.findOne({ password: userPassword }, function(err, data) {
  			if(err) throw err;
  			if(data)
  			{
  				req.session.user = {id:userID,name:userName}; // create User sesion
  				res.redirect('/');// chemain absolu
  			}
  			else
  			{
  				res.render('login.pug',{msgerr_db_pass: 'invalid password',em:userEmail});
  			}
  		});
  	}
  	else
  	{
  		res.render('login.pug',{msgerr_db_em: 'invalid email',em:userEmail});
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