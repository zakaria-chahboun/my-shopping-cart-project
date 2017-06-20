var express = require('express');
var router = express.Router();
var Shop = require('../models/shop'); // load shop Model from Models

router.get('/', checkConnection,checkAdmin,function(req, res, next){

	var UserName = req.session.user.name;
	var UserID = req.session.user.id;

	Shop.find({userID:UserID},function(err,data){
  	res.render('profile', {title:UserName ,userName:UserName,result:data});
	});
});

// check if user not connect
function checkConnection(req,res,next) {
	if(!req.session.user){
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