var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
name: String,
email: String,
password: String,
date: Date
});

userSchema.pre('save', function(next) {// create date automaticly when obj is create
  if (!this.date)
    this.date = new Date();

  next();
});

var User = mongoose.model('users',userSchema);

module.exports = User;