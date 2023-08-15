"use strict";

var path = require('path');

var express = require('express');

var bodyparser = require('body-parser');

var mongoose = require('mongoose');

var session = require('express-session');

var MongoDBStore = require('connect-mongodb-session')(session);

var csrf = require('csurf');

var flash = require('connect-flash');

var multer = require('multer');

var errorcontroller = require('./controllers/error');

var Admin = require('./models/admin');

var MONGODB_URI = 'mongodb+srv://priyanshuthakar24:%40pinku24@cluster0.c77xwlg.mongodb.net/datacollection';
var app = express();
var store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: 'session'
});
var csrfProtection = csrf();
var filestorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'images');
  },
  filename: function filename(req, file, cb) {
    var math = Math.floor(Math.random() * 100001);
    cb(null, new Date().toDateString() + '-' + math + file.originalname);
  }
});

var filefilter = function filefilter(req, file, cb) {
  if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
    req.flash('error', 'Please add jpg or jpeg or png formet');
  }
};

app.set('view engine', 'ejs');
app.set('views', 'views');

var adminroute = require('./routes/admin');

var studentroute = require('./routes/user');

var authroute = require('./routes/auth');

var educationroute = require('./routes/edu');

app.use(bodyparser.urlencoded({
  extended: false
}));
app.use(multer({
  storage: filestorage,
  fileFilter: filefilter
}).single('marksheetlink'));
app.use(express["static"](path.join(__dirname, 'public')));
app.use('/images', express["static"](path.join(__dirname, 'images')));
app.use(session({
  secret: 'my secret',
  resave: false,
  saveUninitialized: false,
  store: store
}));
app.use(csrfProtection);
app.use(flash());
app.use(function (req, res, next) {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.eduisAuthenticated = req.session.isLoggedInedu;
  res.locals.userisAuthenticated = req.session.isLoggedInuser;
  res.locals.csrfToken = req.csrfToken();
  next();
});
app.use(function (req, res, next) {
  if (!req.session.user) {
    return next();
  }

  Admin.findById(req.session.user._id).then(function (user) {
    if (!user) {
      return next();
    }

    req.user = user;
    next();
  })["catch"](function (err) {
    // next( new Error(err)); 
    console.log(err);
  });
});
app.use('/admin', adminroute);
app.use('/edu', educationroute);
app.use(studentroute);
app.use(authroute);
app.use('/500', errorcontroller.get500);
app.use(errorcontroller.get404); // app.use((error, req, res, next) => {
//     res.status(500).render('500',{
//         pagetitle:"Error!",
//         path:"/500"
//     })
// });

mongoose.connect(MONGODB_URI).then(function (result) {
  app.listen(3003);
  console.log("Server listing on 3003");
})["catch"](function (err) {
  console.log(err);
});