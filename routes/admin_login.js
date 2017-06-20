var express = require('express');
var router = express.Router();
var Admin = require('../models/admin'); // load Users Model from Models folder

// Admin Login page (admin_login/)
router.get('/',checkAdmin,checkUserConnection, function(req, res, next) {
	res.render('admin_login.pug',{title:'Admin Login'});
});

router.post('/',function(req,res,next){
	req.assert('adminEmail','invalid email format!').isEmail();
	req.assert('adminPassword','invalid password format!').isLength({min:6});

	// logical errors
  var err = req.validationErrors();
  if(err)
  {
    res.render('admin_login.pug',{logical_err : err,em:req.body.adminEmail});
  }
  else // search user in database
  {
  	var adminEmail = req.body.adminEmail; // from view
  	var adminPassword = req.body.adminPassword; // from view
		
  	Admin.findOne({ email: adminEmail }, function(err, data) {
  	if(err) throw err;
  	if(data)
  	{
  		var adminName = data.name;
		var adminID = data._id;
  		Admin.findOne({ password: adminPassword }, function(err, data) {
  			if(err) throw err;
  			if(data)
  			{
  				req.session.admin = {id:adminID,name:adminName}; // create Admin sesion
  				res.redirect('/admin_manage'); // chemain absolu
  			}
  			else
  			{
  				res.render('admin_login.pug',{logical_db_err: 'invalid password',em:adminEmail});
  			}
  		});
  	}
  	else // email not found!
  	{
  		res.render('admin_login.pug',{logical_db_err: 'invalid email',em:adminEmail});
  	}
 	});
 }
});

// ::: check admin :::
function checkAdmin(req,res,next) {
  if(req.session.admin)
  {
    res.redirect('/admin_manage');
  }else{
    next();
  }
}

// check if user alredy connect
function checkUserConnection(req,res,next) {
	if(req.session.user){
		res.redirect('/');
	}else{
		next();
	}
}


module.exports = router;
