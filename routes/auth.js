const express=require('express');
const router=express.Router();
const authcontroller=require('../controllers/auth');


router.get('/login',authcontroller.getuserLogin);
router.post('/login',authcontroller.postuserLogin);
router.post('/logout',authcontroller.postLogout);
router.get('/admin/login',authcontroller.getAdminLogin);
router.post('/admin/login',authcontroller.postAdminLogin);
router.post('/admin/logout',authcontroller.postAdminLogout);
// router.get('/edu/addschool',authcontroller.getAdminsignUp);
// router.post('/admin/signup',authcontroller.postAdminsignUp);
router.get('/edu/login',authcontroller.getEduLogin);
router.post('/edu/login',authcontroller.postEduLogin);
router.post('/edu/logout',authcontroller.postEduLogout);

module.exports=router;