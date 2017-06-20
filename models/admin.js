var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var adminSchema = new Schema({
name: String,
password: String,
email: String,
date: Date
});

adminSchema.pre('save', function(next) {// create date automaticly when obj is create
  if (!this.date)
    this.date = new Date();

  next();
});

var Admin = mongoose.model('admin',adminSchema);

module.exports = Admin;