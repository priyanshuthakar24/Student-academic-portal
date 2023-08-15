const path = require('path');

const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require("helmet");
const compression = require('compression');


const errorcontroller = require('./controllers/error');
const Admin = require('./models/admin');

const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.c77xwlg.mongodb.net/${process.env.MONGODB_DEFAULT_DATABASE}`;

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'session'
});
const csrfProtection = csrf();
const filestorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const math = Math.floor(Math.random() * 100001)
        cb(null, new Date().toDateString() + '-' + math + file.originalname);
    }
})
const filefilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    } else {
        cb(null, false);
        req.flash('error', 'Please add jpg or jpeg or png formet');
    }
}
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminroute = require('./routes/admin');
const studentroute = require('./routes/user');
const authroute = require('./routes/auth');
const educationroute = require('./routes/edu');

app.use(helmet());
app.use(compression());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(multer({ storage: filestorage, fileFilter: filefilter }).single('marksheetlink'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.eduisAuthenticated = req.session.isLoggedInedu;
    res.locals.userisAuthenticated = req.session.isLoggedInuser;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    Admin.findById(req.session.user._id).then(user => {
        if (!user) {
            return next();
        }
        req.user = user;
        next();
    }).catch(err => {
        // next( new Error(err)); 
        console.log(err);
    });
});



app.use('/admin', adminroute);
app.use('/edu', educationroute);
app.use(studentroute);
app.use(authroute);
app.use('/500', errorcontroller.get500);
app.use(errorcontroller.get404);

// app.use((error, req, res, next) => {
//     res.status(500).render('500',{
//         pagetitle:"Error!",
//         path:"/500"
//     })
// });

mongoose.connect(MONGODB_URI).then(result => {
    app.listen(process.env.PORT || 3003);
    console.log("Server listing on 3003")
}).catch(err => { console.log(err) })