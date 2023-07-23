const express=require('express');
const router=express.Router();
const admincontroller=require('../controllers/admin');
const { route } = require('./user');
const isAuth=require('../middleware/is-auth');


router.get('/index',isAuth,admincontroller.getindex);
router.get('/addstudent',isAuth,admincontroller.getnewform);
router.post('/newstudent',isAuth,admincontroller.poststudentdata);
router.get('/editstudent',isAuth,admincontroller.getstudent);
router.post('/studentid',isAuth,admincontroller.getstudentdetail);
router.get('/addmarksheet/:studentid',isAuth,admincontroller.getaddmarksheet);
router.post('/postmarksheet',isAuth,admincontroller.postaddmarksheet);
router.get('/viewdetail',isAuth,admincontroller.getid);
router.post('/viewdata',isAuth,admincontroller.getstudentdata);
router.get('/editid/:studentid',isAuth,admincontroller.geteditprofile);
router.post('/editdetail',isAuth,admincontroller.posteditprofile)
module.exports=router;