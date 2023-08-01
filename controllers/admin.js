const bcrypt = require('bcryptjs');
const Student = require('../models/student');
const { validationResult } = require('express-validator');

exports.getindex = (req, res, next) => {
    res.render('admin/index', { pagetitle: 'home' });
}


exports.getnewform = (req, res, next) => {
    const editMode = req.query.edit;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }
    res.render('admin/addprofile', { pagetitle: 'New student', editing: editMode, errormessage: message, olddata: { name: "", mobileno: '', dob: '', xender: 'Male', adharno: '', email: '', password: '' } });
}


exports.poststudentdata = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const adrno = req.body.adharno;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        console.log(xender);
        return res.status(402).render('admin/addprofile', { pagetitle: 'Add Profile', path: '/admin/addprofile', editing: false, errormessage: errors.array()[0].msg, olddata: { name: name, mobileno: mobileno, dob: dob, xender: xender, adharno: adrno, email: email, password: password } })
    }
    console.log(req.user);
    Student.findOne({ email: email }).then(adminDoc => {

        bcrypt.hash(password, 12)
            .then(hashedpassword => {
                const data = new Student({
                    name: name, email: email, mobileno: mobileno, adharno: adrno, Dob: dob, xender: xender, adminId: req.user,
                    password: hashedpassword
                });
                return data.save();
            }).then(result => {
                res.redirect('/admin/index');
            })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });

};


exports.getstudent = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/searchbyid', { pagetitle: 'Search Student', errormessage: message })
}

exports.getstudentdetail = (req, res, next) => {
    const studentid = req.body.search;
    console.log(studentid);
    Student.findOne({ adharno: studentid }).then(studentdata => {
        if (!studentdata) {
            req.flash('error', 'Id Dose not Found');
            res.redirect('/admin/editstudent');
        } else {
            // const adminid=studentdata.adminId.toString();
            console.log(studentdata.adminId);
            console.log(req.user._id);
            if (studentdata.adminId.toString() === req.user._id.toString()) {
                res.render('admin/updateprofile', { pagetitle: 'Update Profile', studentdata: studentdata });
            } else {
                req.flash('error', "You can't access this id");
                res.redirect('/admin/editstudent');
            }
        }
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}



exports.getaddmarksheet = (req, res, next) => {
    const studentid = req.params.studentid;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }
    Student.findById(studentid).then(data => {
        console.log(data._id);
        res.render('admin/addmarksheet', { pagetitle: 'add marksheet', studentdata: data, errormessage: message, olddata: { marksheet: "", std: "", result: "Pass", studentid: data._id } });
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
    // console.log(studentid);
}
exports.postaddmarksheet = (req, res, next) => {
    const studentid = req.body.studentid;
    console.log(studentid);
    const marksheetlink = req.file;
    const std = req.body.std;
    const result = req.body.result;
    const marksheet = marksheetlink.path;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(402).render('admin/addmarksheet', { pagetitle: 'Add Profile', path: '/admin/addmarksheet', errormessage: errors.array()[0].msg, olddata: { marksheet: marksheet, std: std, result: result, studentid: studentid } })
    }
    Student.findById(studentid).then(data => {
        const updatedCartItems = [...data.cart.items];
        updatedCartItems.push({ marksheet: marksheet, std: std, result: result });
        const updatedCart = { items: updatedCartItems };
        data.cart = updatedCart;
        return data.save();
    }).then(result => {
        res.redirect('/admin/index');
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
};
// exports.postaddmarksheet = (req, res, next) => {
//     const studentid = req.body.studentid;
//     console.log(studentid);
//     const markshet = req.body.marksheet;
//     const std = req.body.std;
//     const result = req.body.result;
//     const marksheet = markshet.path;
//     Student.findById(studentid).then(data => {
//         const updatedCartItems = [...data.cart.items];
//         updatedCartItems.push({ marksheet: marksheet, std: std, result: result });
//         const updatedCart = { items: updatedCartItems };
//         data.cart = updatedCart;
//         return data.save();
//     }).then(result => {
//         res.redirect('/admin/index');
//     })
// };
exports.getid = (req, res, next) => {
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/searchid', { pagetitle: 'searchid', errormessage: message })
}


exports.getstudentdata = (req, res, next) => {
    const studentid = req.body.search;
    // console.log(studentid);
    Student.findOne({ adharno: studentid }).then(data => {
        if (data) {
            console.log(data);
            res.render('admin/viewprofile', { pagetitle: 'All detail', detail: data })
        }
        else {
            req.flash('error', 'Id Dose not Found');
            res.redirect('/admin/viewdetail');
        }
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}



// student edit detai funcationaly
exports.geteditprofile = (req, res, next) => {
    const editMode = req.query.edit;
    const studentid = req.params.studentid;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }
    Student.findById(studentid).then(data => {
        res.render("admin/addprofile", { pagetitle: 'editdetail', product: data, editing: true, errormessage: message, olddata: { name: "", mobileno: '', dob: '', xender: 'Male', adharno: '', email: '', password: '' } })
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}
exports.posteditprofile = (req, res, next) => {
    const studentid = req.body.studentid;
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const adrno = req.body.adharno;
    const password = req.body.password;
    const errors = validationResult(req);
    let pass;
    if (!errors.isEmpty()) {
        console.log(xender);
        return res.status(402).render('admin/addprofile', { pagetitle: 'Add Profile', path: '/admin/addprofile', editing: true, errormessage: errors.array()[0].msg, product: { name: name, mobileno: mobileno, Dob: dob, xender: xender, adharno: adrno, email: email, password: password } })
    } else {
        Student.findById(studentid).then(data => {
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
            return pass.save();
        }).then(result => {
            console.log("product Updated");
            res.redirect('/admin/index');
        }).catch(err => {
            const error = new Error(err);
            error.httpStatusCode = 500;
            return next(error);
        });
        // console.log(hashedpassword);
        // data.password = hashedpassword
    }
}



// const data = new Student({ name: name, email: email, mobileno: mobileno, adharno: adrno, Dob: dob, xender: xender, adminId: req.user });
//     data.save().then(result => {
//         console.log(result);
//         res.redirect('/admin/index');
//     }).catch(err => console.log(err));