var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var shopSchema = new Schema({
title: String,
total: Number,
quantity: Number,
date: Date,
categoryID: Schema.Types.ObjectId,
userID: Schema.Types.ObjectId,
itemID: Schema.Types.ObjectId
});

shopSchema.pre('save', function(next) {// create date automaticly when obj is create
  if (!this.date)
    this.date = new Date();

  next();
});


var Shop = mongoose.model('shop',shopSchema);

module.exports = Shop;