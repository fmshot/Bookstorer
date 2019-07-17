var createError = require('http-errors');
var express = require('express');
var router = express.Router();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require('body-parser');
var config = require('./config');
var auth = require('./authenticate');
var session = require('express-session');
var FileStore = require('session-file-store')(session);


var passport = require('passport');
var authenticate = require('./authenticate');


var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//Import routes for "catalog" area of site
var catalogRouter = require('./routes/catalog');


//Import the mongoose module
var mongoose = require('mongoose');

//Set up default mongoose connection
const url = config.mongoUrl;
// var mongoDB = 'mongodb://127.0.0.1/BookstoreDB';
// mongoose.connect(mongoDB, { useNewUrlParser: true });
// const connect = mongoose.connect(url, { 
//   useMongoClient: true});
// //Get the default connection
// var db = mongoose.connection;

// //Bind connection to error event (to get notification of connection errors)
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const connect = mongoose.connect(url, {
  useNewUrlParser: true
});

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => {
  console.log(err);
});
// To set up the view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));


// app.use(session({
//   name: 'session-id',
//   secret: '12345-67890-09876-54321',
//   saveUninitialized: false,
//   resave: false,
//   store: new FileStore()
// }));





//Also to Render HTML Pages
// app.use(express.static(path.join(__dirname, 'public')));

// function auth (req, res, next) {
//   console.log(req.user);

//   if (!req.user) {
//     var err = new Error('You are not authenticated!');
//     err.status = 403;
//     next(err);
//   }
//   else {
//         next();
//   }
// }





// app.use('/', routes);
app.use('/', indexRouter);
app.use('/users', usersRouter);
// Add catalog routes to middleware chain.
app.use('/catalog', catalogRouter);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  // res.send(err.message);
  // res.sendStatus(err.status);
  // console.log(err.message);
  res.status(err.status || 500);

  // res.send(err.status);
  // res.render('error');
});

module.exports = app;