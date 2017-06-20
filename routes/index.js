var express = require('express');
var router = express.Router();
var Item = require('../models/items'); // load Item Model from Models folder
var Categories = require('../models/categorys'); // load Categories Model from Models
var Shop = require('../models/shop'); // load shop Model from Models
var panelList = require('./panelList'); // load panelList module


// GET home page
router.get('/',checkAdmin,function(req, res, next){
	if(req.session.user)
	{
		var UserName = req.session.user.name;
	}
	if(req.session.panelList){
		var PanelArray = 0;
		req.session.panelList.forEach(function(el){
			PanelArray++;
		});
	}
	Item.find({},function(err, data){
		if(err) res.status(500).send('Something broke!');
		res.render('index', { title: 'Welcome :)',userName:UserName, products:data,panelArray:PanelArray});
	});
});

// get categories list to the view
router.get('/getCategories',checkAdmin,function(req, res, next){
	Categories.find({},function(err, data){
		if(!err)
			res.send(data);
		else
			res.send(null);
	});
});

// search by category
router.get('/search/category/:id',checkAdmin,function(req, res, next){
	if(req.session.user)
	{
		var UserName = req.session.user.name;
	}
	if(req.session.panelList){
		var PanelArray = 0;
		req.session.panelList.forEach(function(el){
			PanelArray++;
		});
	}
	Item.find({category: req.params.id},function(err, data){
		if(err) res.redirect('/');
		res.render('index', { title: 'Welcome :)',userName:UserName, products:data,panelArray:PanelArray});
	});
});
// search by name
router.get('/search/:name',checkAdmin,function(req, res, next){
	if(req.session.user)
	{
		var UserName = req.session.user.name;
	}
	if(req.session.panelList){
		var PanelArray = 0;
		req.session.panelList.forEach(function(el){
			PanelArray++;
		});
	}
	Item.find({title:{$regex: req.params.name,$options:'i'}},function(err, data){
		if(err) res.redirect('/');

		res.render('index', { title: 'Welcome :)',userName:UserName, products:data,panelArray:PanelArray});
	});
});
// search by id
router.get('/search/id/:id',checkAdmin,function(req, res, next){
	if(req.session.user){
		var UserName = req.session.user.name;
	}
	if(req.session.panelList){
		var PanelArray = 0;
		req.session.panelList.forEach(function(el){
			PanelArray++;
		});
	}
	Item.find({_id:req.params.id},function(err, data){
		if(err) res.redirect('/');
		res.render('index', { title: 'Welcome :)',userName:UserName, products:data,panelArray:PanelArray});
	});
});

// Ajax search / autocomplete
router.post('/search',checkAdmin,function(req, res, next){
	var t = "^$"; // no data
		if(req.body.title)
			t = req.body.title;

	Item.find({title:{$regex: t,$options:'i'}}).select({"title": 1}).exec(function(err, data){
		if(err) res.send(null);
		var result = [];
		for (var i = 0; i < data.length; i++){
			result.push({title: data[i].title, id: data[i]._id});
		}
		res.send(result);
	});
});

// add to panel
router.get('/add_to_cart/:id',checkAdmin, function(req, res, next){
	Item.find({_id:req.params.id}).select({"title":1,"price":1,"quantity":1,"category":1}).exec(function(err, data){
		if(err)
			res.send(null); // invalid id cannot cast to ObjectId

		else if(data.length != 0){
			var DATA = {};
			// the data is one value (one ID in database) but it an array result
			data.forEach(function(el){
				DATA.id = el._id;
				DATA.title = el.title;
				DATA.price = el.price;
				DATA.quantity = el.quantity;
				DATA.category = el.category;
			});
			// if the (panel list session) doesn't exist then create
			if(!req.session.panelList){
			req.session.panelList = [];
			}
			// load panelList module and .. do it just do it :D
			panelList.add(req.session.panelList,DATA);
			res.send(req.session.panelList);
		}
		else{
			res.send(null); // no result
		}
	});
});

// buy :)
router.get('/show_cart',checkAdmin,function(req, res, next){
	/* if the user not login*/
	if(!req.session.user){
		res.send('noLogin');
	}else{
		/* if the user doesn't buy anything */
		if(!req.session.panelList){
			res.send('noItem');
		}else{
			var PanelList = req.session.panelList;
			var HtmlForm = "<form action='/check_out' method='POST' id='checkOutForm'>";

			PanelList.forEach(function(el){

			HtmlForm += '<ul class="collection">'
					+'<li class="collection-item"><b>Title: </b>'+el.title+'</li>'
					+'<li class="collection-item">'
					+'<b>Quantity: </b>'
					+'<input type="number" name='+el.id+' class="center" value='+el.lastQuantity+' />'
					+'</li>'
					+'<li class="collection-item"><b>Price: </b>'+el.price+'</li>'
					+'</ul>'
			});
			HtmlForm += '</form>';
			res.send(HtmlForm);
		}
	}
});

// check out | step 1
router.get('/check_out',function(req, res, next){
	res.redirect('/');
});
router.post('/check_out',checkAdmin,function(req, res, next){
	if(req.body){
		var oo = Object.keys(req.body); // renvoi un array contient les Keys d'un objet 
		var result = [];
		var NoQuantity = [];
		var PanelList = req.session.panelList;
		var ckeck = true;
		var index = 0;

		oo.forEach(function(el){
		Item.findOne({_id:el},function(err, data){
			if(err){
				res.send('Error!'); ckeck = false;
				return;
			}

			if(data){
				/* logical errors */
				// quantity not found in db
				if(data.quantity < req.body[el])
				{	
				NoQuantity.push({msg: "no quantity available for ("+data.title+"), the max quantity is: "+data.quantity});
				}

				req.assert(el,data.title+' | invalid quantity').isLength({min:1}).isNumber().isPositive();
				// add data
				let Price = data.price*req.body[el];
				result.push({title:data.title, quantity: req.body[el], price:Price});

				for (var i = 0; i < PanelList.length; i++){
					if(el == PanelList[i].id)
					PanelList[i].lastQuantity = req.body[el];
				}
			}
				
			// if a last element in "oo" then send response ...ect
			if(index == oo.length -1 && ckeck){
				var err = req.validationErrors();
				if(err)
					res.render('buy.pug',{errors: err});
				else if(NoQuantity.length != 0)
					res.render('buy.pug',{noQuantity:NoQuantity});
				else
					res.render('buy.pug',{results: result,userName:req.session.user.name});
			}
			index ++;
		});
		});
	}
	else{
	res.send(null);
	}
});

// buy | last step
router.get('/buy',checkAdmin,function(req, res, next){
	res.redirect('/');
});
router.post('/buy',checkAdmin,function(req, res, next){

	if(!req.session.panelList && !req.session.user){
		res.redirect('/');
	}
	else{
		var PanelList = req.session.panelList;
		var UserID = req.session.user.id;
		var newShop = null;
		var index=0;

		PanelList.forEach(function(el){
			// create schema
			newShop = new Shop({
				title: el.title,
				total: el.price*el.lastQuantity,
				quantity: el.lastQuantity,
				categoryID: el.category,
				userID: UserID,
				itemID: el.id
			});
			// save schema
			newShop.save(function(err){
				// item quantity --
				Item.findOne({ _id: el.id },function(err,data){
					data.quantity = data.quantity - el.lastQuantity;
					data.save(function(err){});
				});
			});
			// if no item more ..
			if(index == PanelList.length -1){
				req.session.panelList = null;
				res.render('buy.pug',{buy: 'Thank you :)'});	
			}
			index++;
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

module.exports = router;
