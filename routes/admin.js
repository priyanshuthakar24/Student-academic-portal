const express = require('express');
const router = express.Router();
const admincontroller = require('../controllers/admin');
const { route } = require('./user');
const isAuth = require('../middleware/is-auth');
const { check } = require('express-validator');
const Student = require('../models/student');

router.get('/index', isAuth, admincontroller.getindex);
router.get('/addstudent', isAuth, admincontroller.getnewform);
router.post('/newstudent', isAuth, [check('name', 'name is not valid').trim().isAlpha('en-US', {ignore: '\s'}), check('mobileno', 'please enter 10 digit number').isMobilePhone(), check('email', 'please enter valid email').isEmail().normalizeEmail().trim(), check('adharno', "enter 12 digit  number").isLength({ min: 12, max: 12 }).trim().custom((value) => {
    return Student.findOne({ adharno: value }).then(data => {
        if (data) {
            return Promise.reject("you cannot create profile with same adhar id");
        }
    })
}),check('password','password Should be min 4 charcter long..').isLength({min:4}).trim()], admincontroller.poststudentdata);

router.get('/editstudent', isAuth, admincontroller.getstudent);
router.post('/studentid', isAuth, admincontroller.getstudentdetail);
router.get('/addmarksheet/:studentid', isAuth, admincontroller.getaddmarksheet);
router.post('/postmarksheet', isAuth, [check('std',"enater valid Std").isNumeric().isLength({min:1,max:2})],admincontroller.postaddmarksheet);
router.get('/viewdetail', isAuth, admincontroller.getid);
router.post('/viewdata', isAuth, admincontroller.getstudentdata);
router.get('/editid/:studentid', isAuth, admincontroller.geteditprofile);
router.post('/editdetail', isAuth,[check('name', 'name is not valid').trim().isAlpha('en-US', {ignore: '\s'}), check('mobileno', 'please enter 10 digit number').isMobilePhone(), check('email', 'please enter valid email').isEmail().normalizeEmail().trim(), check('adharno', "enter 12 digit  number").isLength({ min: 12, max: 12 }).trim(),check('password','password Should be min 4 charcter long..').isLength({min:4}).trim()], admincontroller.posteditprofile)
module.exports = router;