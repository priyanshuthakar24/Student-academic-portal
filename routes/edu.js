const express = require('express');
const router = express.Router();
const educontroller = require('../controllers/edu');
const isAuth = require('../middleware/is-authedu');
const { check } = require('express-validator');
const Admin = require('../models/admin');
// const { route } = require('./edu');

router.get('/index', isAuth, educontroller.getIndex);
router.get('/addinstitute', isAuth, educontroller.getaddinstitute);
router.post('/addinstitute', isAuth, [check('name', 'name is not valid').trim().isAlpha('en-US', { ignore: '\s' }), check('mobileno', 'please enter 10 digit number').isMobilePhone(), check('email', 'please enter valid email').isEmail().normalizeEmail().trim().custom((value) => {
    return Admin.findOne({ email: value }).then(data => {
        if (data) {
            return Promise.reject("YOu can not create profile with same email id");
        }
    })
}), check('indexno', "enter 12 digit  number").isLength({ min: 2 }).trim(), check('password', 'password Should be min 4 charcter long..').isLength({ min: 4 }).trim()], educontroller.postinstitute);
router.get('/searchid', isAuth, educontroller.getsearchid);
router.post('/searchid', isAuth, educontroller.postsearchid);
router.post('/cart-delete-item',isAuth,educontroller.postCartDeleteProduct);
router.get('/editinstitue',isAuth,educontroller.getsearchbyid);
router.get('/editid/:instituteid',isAuth,educontroller.geteditid)
router.post('/searchbyid',isAuth,educontroller.postsearchbyid);
router.post('/editdetail',isAuth,[check('name', 'name is not valid').trim().isAlpha('en-US', {ignore: '\s'}), check('mobileno', 'please enter 10 digit number').isMobilePhone(), check('email', 'please enter valid email').isEmail().normalizeEmail().trim(), check('indexno', "enter 12 digit  number").isLength({ min: 2 }).trim(),check('password','password Should be min 4 charcter long..').isLength({min:4}).trim()],educontroller.posteditdetail);
router.get('/searchbox',isAuth,educontroller.getsearchbox);
router.post('/studentdetail',isAuth,educontroller.getstudentinformation);
router.post('/updatdetail',isAuth,educontroller.postupdatedetail);
module.exports = router;