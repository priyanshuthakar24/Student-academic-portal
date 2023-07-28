const express=require('express');
const router=express.Router();
const studentcontroller=require('../controllers/student');
const isAuth=require('../middleware/is-authuser');

router.get('/',studentcontroller.getindex);
router.get('/image',studentcontroller.getimage);
// router.post('/studentid',isAuth,studentcontroller.getdetail);
router.post('/viewdetail',isAuth,studentcontroller.getdetail);
// router.get('/viewdetail/:imageid',isAuth,studentcontroller.getimage);
module.exports=router;