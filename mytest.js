var express = require('express');// routes ../pages
// var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');// get query from pages & parse to simple objects
var mongoose = require('mongoose');// mongo db access
mongoose.Promise = global.Promise;
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); // store the sessions in db

var app = express();

app.set('view engine', 'pug'); // type of view pages like 'html' 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// :: Mongodb ::
mongoose.connect('mongodb://127.0.0.1:27017/market');// simple connect

app.use(cookieParser());
app.use(session({
	secret: "zaki secret",
	saveUninitialized:false,
	resave:false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl : 60 // 60 seconds to remove session
	})
}));

//-------------------------------------------------------
app.get('/pugpage',function (req,res) {
	res.render('one',{vary : {msg : 'new message',id : '0A005', tab:['A','B','C']},qs : req.query});
});


var mySchema = new mongoose.Schema({ // define the schema and set the correct type
	first_name : String,
	last_name : String,
	email : String
});

var collection = mongoose.model('infos',mySchema);//collection name and schema to use

app.get('/welcome',function (req,res) {
	res.render('welcome.pug');
});

app.post('/welcome',function (req,res) {
	var emptyData = false;
	
	// if all fields is not empty
	if(req.body.firstName && req.body.lastName && req.body.email){
	var insertInfo = collection({ // insert infos elements in db
			first_name: req.body.firstName,
			last_name: req.body.lastName,
			email: req.body.email
			
		}).save(function(err){
			if(err){ // if data not saved in mongo db
					emptyData = true;
					res.render('welcome.pug',{EmptyData : emptyData});
			}else{ // Successful data :)
				res.render('welcome.pug',{
				EmptyData : emptyData
				});
			}		
		});
	}
	else{// if all fields is empty
			emptyData = true;
			res.render('welcome.pug',{
				firstName : req.body.firstName,
				lastName : req.body.lastName,
				email : req.body.email,
				EmptyData : emptyData
			});
		}
});

app.get('/show',function (req,res) {
	// get infos from fb
	collection.find({},function(err,data){
		if (!err)
		res.render('show_infos.pug',{documents:data});
	});
});
app.delete('/show/:id',function (req,res) {
	// delet user from fb
	collection.remove({_id:req.params.id},function(err,data){
		if (!err)
		res.render('show_infos.pug',{documents:data});
	});
});

//////////// Sesstion Test ////////
app.get('/test',checkConnection,function(req,res) {
	res.render('test.pug',{name: req.session.page_views})
});

function checkConnection(req,res,next) {
	if(req.session.page_views){
		next();
	}else{
		res.redirect('/');
	}
}
app.get('/',function(req,res) {
	if(!req.session.page_views){
		res.render('one.pug');
	}else{
   		res.redirect('/test');
   	}
});
app.post('/', function(req, res){
   var name = req.body.name;
   	if(name == 'zakaria')
   	{
   		req.session.page_views = name;
   		res.redirect('/test');
   	}
   	else{
   		res.render('one.pug',{err: 'Invalid value'});
   	}
});
app.get('/logout',function(req,res) {
	req.session.destroy();
	res.redirect('/');
})

app.use(express.static('public'));

//-------------------------------------------------------

app.use(function (req, res, next) {
  res.status(404).send("هذه الصفحة لا توجد")
});
app.listen(3000,function (err) {
	console.log('we listen to localhost:3000 ..');
});