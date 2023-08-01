const express = require('express');
const router = express.Router();
const authcontroller = require('../controllers/auth');
const { check } = require('express-validator');
const Student = require('../models/student');
const Admin = require('../models/admin');
const Education = require('../models/edu');
const bcrypt = require('bcryptjs');

router.get('/login', authcontroller.getuserLogin);
router.post('/login', [check('adharno', 'adhar no length shoud be 12 digit logn..').isLength({ min: 12, max: 12 }).custom((value, { req }) => {
    return Student.findOne({ adharno: value }).then(data => {
        if (!data) { return Promise.reject('AAdhar number not exists, please pick a different one.') }
    })
}), check('password', 'password should be 4 charreacter long').isLength({ min: 4 }).custom((value, { req }) => {
    return Student.findOne({ adharno: req.body.adharno }).then(data => {
        return bcrypt.compare(value, data.password).then(doMatch => {
            if (!doMatch) { return Promise.reject('Password dose not match'); }
        })
    })
})], authcontroller.postuserLogin);
router.post('/logout', authcontroller.postLogout);
router.get('/admin/login', authcontroller.getAdminLogin);
router.post('/admin/login', [check('email', '').isEmail().normalizeEmail().custom((value) => {
    return Admin.findOne({ email: value }).then(data => {
        if (!data) {
            return Promise.reject('email does not found');
        }
    })
}), check('password', 'password should be minimum 4 character long..').isLength({ min: 4 }).custom((value, { req }) => {
    return Admin.findOne({ email: req.body.email }).then(data => {
        return bcrypt.compare(value, data.password).then(doMatch => {
            if (!doMatch) {
                return Promise.reject('password Dose not match');
            }
        })
    })
})], authcontroller.postAdminLogin);
router.post('/admin/logout', authcontroller.postAdminLogout);
// router.get('/edu/addschool',authcontroller.getAdminsignUp);
// router.post('/admin/signup',authcontroller.postAdminsignUp);
router.get('/edu/login', authcontroller.getEduLogin);
router.post('/edu/login', [check('email', 'not valid email').isEmail().normalizeEmail().custom((value) => {
    return Education.findOne({ email: value }).then(data => {
        if (!data) {
            return Promise.reject('email does not found');
        }
    })
}), check('password', 'password should be minimum 4 character long..').isLength({ min: 4 }).custom((value, { req }) => {
    return Education.findOne({ email: req.body.email }).then(data => {
        return bcrypt.compare(value, data.password).then(doMatch => {
            if (!doMatch) {
                return Promise.reject('password Dose not match');
            }
        })
    })
})], authcontroller.postEduLogin);
router.post('/edu/logout', authcontroller.postEduLogout);

module.exports = router;