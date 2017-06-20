
var mongoose = require('mongoose');
var Shop = require('./models/shop'); // load shop Model from Models
var Category = require('./models/categorys'); // load shop Model from Models

// :: Mongodb ::
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/market');// simple connect

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

	console.log(data2);

	});
});