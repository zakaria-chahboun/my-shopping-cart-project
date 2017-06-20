var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // sample form
var expressValidator = require('express-validator');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session); // store the sessions in db

var index = require('./routes/index');
var adminLogin = require('./routes/admin_login');
var adminManage = require('./routes/admin_manage');
var login = require('./routes/login');
var profile = require('./routes/profile');
var newaccount = require('./routes/newaccount');
var logout = require('./routes/logout');

var app = express();

// :: Mongodb ::
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://127.0.0.1:27017/market');// simple connect

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator({
customValidators: { // my own validations ^^
  isDate : function(str) {
        return !isNaN(Date.parse(str));
    },
  isNumber : function(str) {
        return !isNaN(str);
    },
  isPositive :function(str) {
    return str > 0;
  }
}
}));// after bodyParser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({// after cookieParser
	secret: "zaki secret",
	saveUninitialized:false,
	resave:false,
	store: new MongoStore({
		mongooseConnection: mongoose.connection,
		ttl : 60*60 // after 1h remove this session | 14*24*60*60 == 14 days
	})
}));

app.use('/', index);
app.use('/admin_login', adminLogin);
app.use('/admin_manage', adminManage);
app.use('/login', login);
app.use('/profile', profile);
app.use('/newaccount', newaccount);
app.use('/logout', logout);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
