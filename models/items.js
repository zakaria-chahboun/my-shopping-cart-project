var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var itemSchema = new Schema({
title: String,
image: String,
infos: String,
price: Number,
category: Schema.Types.ObjectId,
quantity: Number,
date: Date
});

itemSchema.pre('save', function(next) {// create date automaticly when obj is create
  if (!this.date)
    this.date = new Date();

  next();
});

var Item = mongoose.model('items',itemSchema);

module.exports = Item;