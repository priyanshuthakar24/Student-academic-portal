const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const Education = require('../models/edu');
const Student = require('../models/student');

exports.getuserLogin = (req, res, next) => {
    res.render('auth/userlogin', { pagetitle: 'Login', path: '/login' });
}
exports.postuserLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Student.findOne({ email: email }).then(data => {
        if (!data) {
            return res.redirect('/login');
        } bcrypt.compare(password, data.password).then(doMatch => {
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
            res.redirect('/login');
        }).catch(err => {
            console.log(err);
            res.redirect('/login');
        });

    }).catch(err => { console.log(err) });
}


exports.getAdminLogin = (req, res, next) => {
    res.render('auth/adminlogin', { pagetitle: 'Login', path: '/admin/login' });
}


exports.postAdminLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Admin.findOne({ email: email }).then(data => {
        if (!data) {
            return res.redirect('/admin/login');
        }
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
            res.redirect('/admin/login');
        }).catch(err => {
            console.log(err);
            res.redirect('/admin/login');
        });

    }).catch(err => { console.log(err) });

};





exports.getEduLogin = (req, res, next) => {
    res.render('auth/edulogin', { pagetitle: 'Login', path: '/admin/login' });
}


exports.postEduLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    Education.findOne({ email: email }).then(data => {
        if (!data) {
            res.redirect('/edu/login');
        }
        return bcrypt.compare(password, data.password)
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
                res.redirect('/edu/login');
            }).catch(err => {
                console.log(err);
                res.redirect('/edu/login');
            });

    }).catch(err => { console.log(err) });
}

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