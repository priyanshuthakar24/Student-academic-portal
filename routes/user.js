const express=require('express');
const router=express.Router();
const studentcontroller=require('../controllers/student');

router.get('/',studentcontroller.getindex);
router.post('/studentid',studentcontroller.getdetail);
router.get('/viewdetail',studentcontroller.getstudentid);
module.exports=router;