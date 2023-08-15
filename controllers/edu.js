const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const Student = require('../models/student');
const { validationResult } = require('express-validator');

exports.getIndex = (req, res, next) => {
    const name = req.session.user;
    res.render('education/index', { pagetitle: 'edu Home', name: name.name });
}
exports.getaddinstitute = (req, res, next) => {
    const name = req.session.user;
    let message = req.flash("error");
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('education/addinstitute', { pagetitle: 'add Institute', editing: false, errormessage: message, olddata: { name: "", mobileno: "", indexno: "", email: "", password: "" }, name: name.name });
}
exports.postinstitute = (req, res, next) => {
    const name1 = req.session.user;
    const email = req.body.email;
    const password = req.body.password;
    const mobileno = req.body.mobileno;
    const indexno = req.body.indexno;
    const name = req.body.name;
    const errors = validationResult(req);
    const confirmpassword = req.body.confirmpassword;
    if (!errors.isEmpty()) {
        return res.status(402).render('education/addinstitute', { pagetitle: 'Add Profile', path: '/edu/addprofile', errormessage: errors.array()[0].msg, editing: false, olddata: { name: name, mobileno: mobileno, indexno: indexno, email: email, password: password }, name: name1.name })
    }
    Admin.findOne({ email: email }).then(adminDoc => {
        bcrypt.hash(password, 12)
            .then(hashedpassword => {
                const admin = new Admin({
                    email: email,
                    name: name,
                    mobileno: mobileno,
                    indexno: indexno,
                    password: hashedpassword
                });
                return admin.save();
            }).then(result => {
                res.redirect('/edu/index');
            })
    }).catch(err => {
        console.log(err)
    });
};

exports.getsearchid = (req, res, next) => {
    // const searchid=req.body.search;
    const name = req.session.user;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    // res.render('admin/searchid', { pagetitle: 'searchid' })
    res.render('education/searchid', { pagetitle: 'delet marksheet', errormessage: message, name: name.name });
}
exports.postsearchid = (req, res, next) => {
    const name = req.session.user;
    const studentid = req.body.search;
    // console.log(studentid);
    Student.findOne({ adharno: studentid }).then(data => {
        if (data) {
            console.log(data);
            res.render('education/deletemarksheet', { pagetitle: 'All detail', detail: data, name: name.name })
        }
        else {
            req.flash('error', 'Id Dose not Found');
            res.redirect('/edu/searchid');
        }
    }).catch(err => {
        console.log(err);
    });
}
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const adharno = req.body.adharno;
    console.log(prodId);
    Student.findOne({ adharno: adharno }).then(data => {
        console.log("method call");
        data.removefromCart(prodId)
    })
        .then(result => {
            res.redirect('/edu/index');
        }).catch(err => {
            console.log(err);
        });
};

exports.getsearchbyid = (req, res, next) => {
    const name = req.session.user;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    // res.render('admin/searchid', { pagetitle: 'searchid' })
    res.render('education/searchbyid', { pagetitle: 'edit detail', errormessage: message, name: name.name });
}


exports.postsearchbyid = (req, res, next) => {
    const name = req.session.user;
    const email = req.body.search;
    // console.log(studentid);
    Admin.findOne({ email: email }).then(data => {
        if (data) {
            console.log(data);
            res.render('education/updateprofile', { pagetitle: 'All detail', studentdata: data, name: name.name })
        }
        else {
            req.flash('error', 'Enter valid Email Id');
            res.redirect('/edu/editinstitue');
        }
    })

}
exports.geteditid = (req, res, next) => {
    const email = req.params.instituteid;
    const name = req.session.user;
    Admin.findById(email).then(data => {
        let message = req.flash("error");
        if (message.length > 0) {
            message = message[0];
        } else {
            message = null;
        }

        console.log(data);
        res.render('education/addinstitute', { pagetitle: 'All detail', product: data, errormessage: message, editing: true, name: name.name })


    }).catch(err => {
        console.log(err);
    });
}

exports.posteditdetail = (req, res, next) => {
    const name1 = req.session.user;
    const instituteid = req.body.instituteid;
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const indexno = req.body.indexno;
    const password = req.body.password;
    const errors = validationResult(req);
    const instituteid1 = instituteid.toString();
    console.log(instituteid1);
    let pass;

    if (!errors.isEmpty()) {
        return res.status(402).render('education/addinstitute', { pagetitle: 'Add Profile', path: '/edu/addinstitute', editing: true, errormessage: errors.array()[0].msg, product: { name: name, mobileno: mobileno, indexno: indexno, email: email, password: password }, name: name1.name })
    } else {
        Admin.findOne({ _id: instituteid }).then(data => {
            pass = data;
            return bcrypt.hash(password, 12)
        }).then(hashedpassword => {
            pass.name = name;
            pass.email = email;
            pass.mobileno = mobileno;
            pass.indexno = indexno
            pass.password = hashedpassword;
            return pass.save();
        }).then(result => {
            console.log("product Updated");
            res.redirect('/edu/index');
        }).catch(err => {
            console.log(err);
        })
    }
}

exports.getsearchbox = (req, res, next) => {
    const name = req.session.user;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    // res.render('admin/searchid', { pagetitle: 'searchid' })
    res.render('education/studentsearchid', { pagetitle: 'edit detail', errormessage: message, name: name.name });
}

exports.getstudentinformation = (req, res, next) => {
    const name = req.session.user;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    const adharno = req.body.search;
    Student.findOne({ adharno: adharno }).then(data => {
        if (data) {
            res.render('education/studentdetail', { pagetitle: 'student detail', editing: true, product: data, errormessage: message, name: name.name })
        } else {
            req.flash('error', 'Enter Valid Aadhhar No');
            res.redirect('/edu/searchbox');
        }
    }).catch(err => {
        console.log(err);
    })
}
exports.postupdatedetail = (req, res, next) => {
    const name1 = req.session.user;
    const studentid = req.body.studentid;
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const adrno = req.body.adharno;
    const password = req.body.password;
    const adminid = req.body.adminid;
    const errors = validationResult(req);
    let pass;
    console.log(adminid);
    if (!errors.isEmpty()) {
        console.log(xender);
        return res.status(402).render('education/studentdetail', { pagetitle: 'Add Profile', path: '/edu/studentdetail', editing: true, errormessage: errors.array()[0].msg, product: { name: name, mobileno: mobileno, Dob: dob, xender: xender, adharno: adrno, email: email, password: password, adminid: adminid }, name: name1.name })
    } else {
        Student.findOne({ adharno: adrno }).then(data => {
            pass = data;
            return bcrypt.hash(password, 12)

            console.log(hashedpassword);
            // data.password=hashedpassword;
        }).then(hashedpassword => {
            pass.name = name;
            pass.email = email;
            pass.mobileno = mobileno;
            pass.Dob = dob
            pass.xender = xender;
            pass.adharno = adrno;
            pass.password = hashedpassword;
            pass.adminId = adminid;
            return pass.save();
        }).then(result => {
            console.log("product Updated");
            res.redirect('/edu/index');
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
        // console.log(hashedpassword);
        // data.password = hashedpassword
    }
}

// Student.findOne({ adharno: adharno }).then(data => {
//     const updatedCartItems = data.cart.items
//     updatedCartItems.filter(item => {
//         return item.std.toString() !== prodId.toString();
//     });
//     console.log(updatedCartItems);
//     data.cart.items = updatedCartItems;
//     return data.save()
// })
// const email = req.body.search;
// Admin.findOne({ email: email }).then(data => {
//     if (data) {
//         let message = req.flash("error");
//         if (message.length > 0) {
//             message = message[0];
//         } else {
//             message = null;
//         }
//         console.log(data);
//         res.render('education/addinstitute', { pagetitle: 'All detail', product: data, errormessage: message, editing: true })
//     }
//     else {
//         req.flash('error', 'Id Dose not Found');
//         res.redirect('/edu/searchid');
//     }
// }).catch(err => {
//     console.log(err);
// });