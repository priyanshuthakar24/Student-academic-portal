const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const Education = require('../models/edu');
const Student = require('../models/student');
const { validationResult } = require('express-validator');


exports.getuserLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/newlogin', { pagetitle: 'Login', path: '/login', errormessage: message, olddata: { adharno: "", password: "" } });
}

exports.postuserLogin = (req, res, next) => {
    const adharno = req.body.adharno;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(402).render('auth/newlogin', { pagetitle: 'Login', path: '/login', errormessage: errors.array()[0].msg, olddata: { adharno: adharno, password: password } })
    }
    Student.findOne({ adharno: adharno }).then(data => {
        bcrypt.compare(password, data.password).then(doMatch => {
            if (doMatch) {
                req.session.isLoggedInuser = true;
                req.session.isLoggedInedu = false;
                req.session.isLoggedIn = false;
                req.session.user = data;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/');
                });
            }
            // req.flash('err', 'Invalid email or password');
            res.redirect('/login');
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        })

    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}




exports.getAdminLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/adminlogin', { pagetitle: 'Login', path: '/admin/login', errormessage: message, olddata: { email: "", password: "" } });
}

exports.postAdminLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(402).render('auth/adminlogin', { pagetitle: 'Login', path: '/admin/login', errormessage: errors.array()[0].msg, olddata: { email: email, password: password } })
    }
    Admin.findOne({ email: email }).then(data => {
        // if (!data) {
        //     req.flash('error', 'Invalid email or password ');
        //     return res.redirect('/admin/login');
        // }
        bcrypt.compare(password, data.password).then(doMatch => {
            if (doMatch) {
                req.session.isLoggedIn = true;
                req.session.isLoggedInuser = false;
                req.session.isLoggedInedu = false;
                req.session.user = data;
                return req.session.save(err => {
                    console.log(err);
                    res.redirect('/admin/index');
                });
            }
            // req.flash('error', 'Invalid email or password ');
            res.redirect('/admin/login');
        }).catch(err => {
            console.log(err);
            res.redirect('/admin/login');
        });

    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};





exports.getEduLogin = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('auth/edulogin', { pagetitle: 'Login', path: '/edu/login', errormessage: message, olddata: { email: "", password: "" } });
}

exports.postEduLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors=validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array());
        return res.status(402).render('auth/edulogin', { pagetitle: 'Login', path: '/edu/login', errormessage: errors.array()[0].msg, olddata: { email: email, password: password } })
    }
    Education.findOne({ email: email }).then(data => {
        // if (!data) {
        //     req.flash('error', 'Invalid email or password ');
        //     res.redirect('/edu/login');
        // }
        bcrypt.compare(password, data.password)
            .then(Domatch => {
                if (Domatch) {
                    req.session.isLoggedInedu = true;
                    req.session.isLoggedInuser = false;
                    req.session.isLoggedIn = false;
                    req.session.user = data;
                    return req.session.save(err => {
                        console.log(err);
                        res.redirect('/edu/index');
                    });
                }
                // req.flash('error', 'Invalid email or password ');
                res.redirect('/edu/login');
            }).catch(err => {
                console.log(err);
                res.redirect('/edu/login');
            });

    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}






// logout section 
exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};
exports.postAdminLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};
exports.postEduLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
};

















// exports.getAdminsignUp = (req, res, next) => {
//     res.render('auth/signup', { path: '/admin/signup', pagetitle: 'signup' });
// };
// exports.postAdminsignUp = (req, res, next) => {
    //     const email = req.body.email;
        //     const password = req.body.password;
        //     const confirmpassword = req.body.confirmpassword;
        //     Admin.findOne({ email: email }).then(adminDoc => {
        //         if (adminDoc) {
        //             res.redirect('/admin/signup');
        //         }
        //         return bcrypt.hash(password, 12)
        //             .then(hashedpassword => {
        //                 const admin = new Admin({
        //                     email: email,
        //                     password: hashedpassword
        //                 });
        //                 return admin.save();
        //             }).then(result => {
        //                 res.redirect('/admin/login');
        //             })
        //     }).catch(err => console.log(err));
        // };