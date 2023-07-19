const express=require('express');
const router=express.Router();
const admincontroller=require('../controllers/admin');
const { route } = require('./user');
router.get('/index',admincontroller.getindex);
router.get('/addstudent',admincontroller.getnewform);
router.post('/newstudent',admincontroller.poststudentdata);
router.get('/editstudent',admincontroller.getstudent);
router.post('/studentid',admincontroller.getstudentdetail);
router.get('/addmarksheet/:studentid',admincontroller.getaddmarksheet);
router.post('/postmarksheet',admincontroller.postaddmarksheet);
router.get('/viewdetail',admincontroller.getid);
router.post('/viewdata',admincontroller.getstudentdata);
router.get('/editid/:studentid',admincontroller.geteditprofile);
router.post('/editdetail',admincontroller.posteditprofile)
module.exports=router;