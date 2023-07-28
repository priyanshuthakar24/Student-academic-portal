const express=require('express');
const router=express.Router();
const educontroller=require('../controllers/edu');
const isAuth=require('../middleware/is-authedu');

router.get('/index',isAuth,educontroller.getIndex);
router.get('/addinstitute',isAuth,educontroller.getaddinstitute);
router.post('/addinstitute',isAuth,educontroller.postinstitute);
router.get('/searchid',isAuth,educontroller.getsearchid);
router.post('/searchid',isAuth,educontroller.postsearchid);
// router.post('/cart-delete-item  ',isAuth,educontroller.postCartDeleteProduct);
module.exports=router;