var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
name: String
});

var Category = mongoose.model('categorys',categorySchema);

module.exports = Category;