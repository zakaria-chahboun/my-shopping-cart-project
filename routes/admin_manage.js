var express = require('express');
var router = express.Router();
var Category = require('../models/categorys'); // load Categorys Model
var Item = require('../models/items'); // load Items Model
var fs = require('fs'); // load Items Model
var Shop = require('../models/shop'); // load shop Model from Models
var User = require('../models/users'); // load users Model from Models

var multer  = require('multer'); // multipart/form-data -- for file
var upload = multer({ dest: '/uploads/'}); // tmp folder

var randomColor = require('random-color');// random colors :)

// HOME PAGE ADMIN MANAGE
router.get('/', checkConnection,checkAdmin,function(req, res, next){
	var AdminName = req.session.admin.name;
	var DATA = [0,0,0,0,0,0,0]; // 7 day :)
	var today = new Date();
	var lastWeek = new Date();
	lastWeek.setDate(today.getDate()-6); // getDate() is the number of day :)
	var val = "";
	var i=0;

	Shop.find({date:{$lte:today,$gt:lastWeek}}).select({date:1,total:1}).exec(function(err,data){
		data.forEach(function(el){
			val = el.date.getDay(); // day in the week from 0 to 6

			DATA[val] += el.total;

			if(i == data.length-1){
			res.render('admin_manage.pug', {title:'ADMIN MANAGE',arr:DATA,adminName:AdminName});
			}		
			i++;
		});
	});
});

//:::::::::: Products Manage Page :::::::::://
router.get('/products', checkConnection,checkAdmin,function(req, res, next){
	var AdminName = req.session.admin.name;

  	res.render('products.pug', {title:'PRODUCTS MANAGE',adminName:AdminName});
});

/* Add Category */
router.get('/products/addCategory',function(req, res, next){
	res.redirect('/admin_manage/products');
});

router.post('/products/addCategory',function(req, res, next) {
	req.assert('newCategory','invalid category length!').isLength({min:3});

	var AdminName = req.session.admin.name; // name of admin in this session
	var newCategory = req.body.newCategory.toLowerCase(); // from view

  // logical errors
  var errr = req.validationErrors();
  if(errr)
  {
  	res.render('products.pug', {catErrorLogic:errr,title:'PRODUCTS MANAGE',adminName:AdminName});
  }
  else
  {
  	 // search category name in database - alredy exist
  	Category.findOne({ name: newCategory }, function(err, data) {
  	if(err) throw err;
  	if(data)
  	{
  		res.render('products.pug',{catError : 'déja existe!',title:'PRODUCTS MANAGE',adminName:AdminName});
  	}
  	// tous marche bien ;) donc crée une nouvelle Categorie 
  	else
  	{
  		var newcategory = new Category({
  			name: newCategory
  		});
  		newcategory.save(function (err){
  			if(err) throw err;
	  		res.render('products.pug',{catSucc : 'la catégorie a été créé avec succès!',title:'PRODUCTS MANAGE',adminName:AdminName});
		});
  	}
 	});
 }
});

/* Add Item */
router.get('/products/addItem',function(req, res, next){
	res.redirect('/admin_manage/products');
});

router.post('/products/addItem',upload.single('image'),function(req, res, next) { // upload.single('image') image is name feild in the view
	req.assert('title','invalid title length! | minimum 5').isLength({min:5});
	req.assert('infos','invalid description length! | minimum 20').isLength({min:20});
	req.assert('price','invalid price!').isLength({min:1}).isNumber().isPositive();
	req.assert('quantity','invalid quantity!').isLength({min:1}).isNumber().isPositive();
	req.assert('categorysList','invalid category length!').isLength({min:1});
	req.assert('date','invalid date!').isDate(); // isDate, isNumber, isPositive : my functions (look app.js - express-validator)

var AdminName = req.session.admin.name;
var FormResult = {
	title : req.body.title,
	infos : req.body.infos,
	price : req.body.price,
	quantity : req.body.quantity,
	categorysList : req.body.categorysList,
	date : req.body.date
};

var myImageType = ''; // type like (image/png) ...
var myRealImageType = '' // type like (.png .jpg ...)
var myImagePath = ''; // sorage directory in the server

//::: logical errors :::
var err = req.validationErrors();
var allErr = [];

// scan all ligical errors
if(err || !req.file || req.file == undefined){
	/* if incorrect simple fields */
	if(err){
		err.forEach(function(el){	
			allErr.push(el.msg);
		});
	}
	/* if incorrect image field */
	if(!req.file || req.file == undefined){
		allErr.push('empty iamge!');
	}
	res.render('products.pug',{itemErrorLogic:allErr,title:'PRODUCTS MANAGE',adminName:AdminName,formResult:FormResult});
}
else//::: database and save image check errors :::
{
	var isImage = true;
	if (req.file)
	{
		myImageType = req.file.mimetype.toLowerCase();
		/* if 'image field' exist but is not an image */
		if(myImageType != 'image/png' && myImageType != 'image/jpeg'){
			allErr.push('image : only JPG or PNG type');
			isImage = false;
			res.render('products.pug',{itemErrorLogic:allErr,title:'PRODUCTS MANAGE',adminName:AdminName,formResult:FormResult});
		}else if(myImageType == 'image/jpeg')
			myRealImageType = '.jpg';
		else if(myImageType == 'image/png')
			myRealImageType = '.png';
	}

	/* c'est aucun logique erreurs do .. */
	if(isImage)
	{
		/* create a new product (item) */
		newItem = new Item({
			title : FormResult.title,
			infos : FormResult.infos,
			price : FormResult.price,
			quantity : FormResult.quantity,
			category : FormResult.categorysList,
			date : FormResult.date,
		});
		newItem.image = '/images/upload/'+newItem._id+myRealImageType;
		myImagePath = __dirname+'/../public/images/upload/'+newItem._id+myRealImageType;

		/* create image in the hard disk */
		fs.readFile(req.file.path, function (err, data){
			if(err) throw err;
			fs.writeFile(myImagePath, data, function (err){
				if(err) throw err;

				newItem.save(function(err){
					if(err){
						/* is the data unsaved in database remove image */
						fs.unlink(myImagePath,function(err){});
						throw err;
					}else{
					/* touts est bien ;) */
					res.render('products.pug',{itemSucc : 'good!',title:'PRODUCTS MANAGE',adminName:AdminName});
					}
				});
			});
		});
	}
}
});


//:::::::::: Products Manage Search Page :::::::::://

router.delete('/products/search/:id',checkConnection,checkAdmin,function(req, res, next){
	Item.remove({_id:req.params.id},function(err){
		if(err) throw err;
		res.send('ok');
	});
});

router.get('/products/search',checkConnection,checkAdmin,function(req, res, next){
	var AdminName = req.session.admin.name;

	// populate [path = field in "Item"] [model = name of model] (ref by "_id")
	Item.find({}).populate({path:'category',model:'categorys'}).exec(function(err, data){
		if(err) throw err;
		if(data)
		{
			res.render('products_search.pug', { title: 'Products Search',adminName:AdminName, products:data});
		}
		else
		{
			Products = [{_id:'A000',title:null,price:null,infos:null,category:null,image:''}];
			res.render('products_search.pug', { title: 'Products Search',adminName:AdminName, products:Products});
		}

	});
});

/* modify an item */
router.get('/products/search/modify/:id',function(req, res, next){
	var AdminName = req.session.admin.name;
	var item = req.params.id;

	Item.findOne({_id:item}).populate({path:'category',model:'categorys'}).exec(function(err, data){
		if(err)
			res.render('modify_item.pug',{title:'Modify',adminName:AdminName,Xrror:'ERROR!'});
		else
			res.render('modify_item.pug',{title:'Modify',adminName:AdminName,Item:data});
	});
});

router.post('/products/search/modify/',function(req, res, next) {

	req.assert('title','invalid title length! | minimum 5').isLength({min:5});
	req.assert('infos','invalid description length! | minimum 20').isLength({min:20});
	req.assert('price','invalid price!').isLength({min:1}).isNumber().isPositive();
	req.assert('quantity','invalid quantity!').isLength({min:1}).isNumber().isPositive();
	req.assert('categorysList','invalid category length!').isLength({min:1});
		
	var AdminName = req.session.admin.name;
	var QQ = {
		id: req.body.ids,
		title : req.body.title,
		infos : req.body.infos,
		price : req.body.price,
		quantity : req.body.quantity,
		category : req.body.categorysList,
	};

	//::: logical errors :::
	var LErr = req.validationErrors();

	Item.findOne({_id:QQ.id}).populate({path:'category',model:'categorys'}).exec(function(err, data){
		if(err)
			res.render('modify_item.pug',{title:'Modify',adminName:AdminName,Xrror:'ERROR!'});
		else if(LErr)
			res.render('modify_item',{title:'Modify',adminName:AdminName,modifyErr:LErr,Item:data});
		else if(data){
				data.title = QQ.title;
				data.infos = QQ.infos;
				data.price = QQ.price;
				data.quantity = QQ.quantity;
				data.category = QQ.category;
				data.save(function(err){
					if(err)
						res.render('modify_item.pug',{title:'Modify',adminName:AdminName,Xrror:'ERROR!'});
					else
						res.render('modify_item.pug',{title:'Modify',adminName:AdminName,Succ:'updated successfully!'});
				});
			}
		else
			res.render('modify_item.pug',{title:'Modify',adminName:AdminName,Item:data});
	});
});

// send categories to view with ajax
router.get('/products/CategoryList',checkConnection,checkAdmin,function(req, res, next){

	Category.find({}, function(err, data) {
  		if(err) throw err;
		res.send({categoryList : data});
  	});

});

//:::::::::: More Page :::::::::://
router.get('/more',checkConnection,checkAdmin,function(req, res, next){
	var AdminName = req.session.admin.name;
	var color = randomColor(0.3, 0.99);
	var CategoyiesName = [];
	var CategoyiesQuantity = [];
	var CategoyiesTotal = [];
	var Colors = [];

	var d = [
	{
		$group :
			{
				_id : "$categoryID",
			quantity : {$sum : "$quantity"},
			total : {$sum : "$total"}
		}
	}
	];

	Shop.aggregate(d).exec(function(err, data1){
		Category.populate(data1, {path: '_id'}, function(err, data2){
			data2.forEach(function(val){	
				CategoyiesName.push("'"+val._id.name+"'");
				CategoyiesQuantity.push(val.quantity);
				CategoyiesTotal.push(val.total);
				color = randomColor(0.3, 0.99);
				Colors.push("'"+color.hexString()+"'");
				if(CategoyiesName.length == data2.length)
				{
				var package = {
				colors : Colors,
				lables : CategoyiesName,
				quantitys : CategoyiesQuantity,
				total : CategoyiesTotal
				};
				res.render('more.pug',{title:'MORE DETAILS',arr:package,adminName:AdminName});
				}
			});
		});
	});
});

//:: manage users :://
/* show */
router.get('/users',checkConnection,checkAdmin,function(req, res, next){
	AdminName = req.session.admin.name;
	
	User.find({},function(err,data){
	res.render('users.pug',{title:'USERS',adminName:AdminName,users:data});
	});
});

/* delete users */
router.delete('/users/:id',checkConnection,checkAdmin,function(req, res, next){
	User.remove({_id:req.params.id},function(err){
		res.send('ok');
	});
});

/*_____________ Check _____________*/
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
  if(!req.session.admin)
  {
    res.redirect('/');
  }else{
    next();
  }
}
module.exports = router;