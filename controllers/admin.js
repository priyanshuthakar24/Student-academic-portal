const bcrypt = require('bcryptjs');
const Student = require('../models/student')

exports.getindex = (req, res, next) => {
    res.render('admin/index', { pagetitle: 'home' });
}


exports.getnewform = (req, res, next) => {
    res.render('admin/addprofile', { pagetitle: 'New student', editing: false });
}


exports.poststudentdata = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const adrno = req.body.adharno;
    const password = req.body.password;
    // console.log(req.user);
    Student.findOne({ email: email }).then(adminDoc => {
        if (adminDoc) {
            res.redirect('/admin/addprofile');
        }
        return bcrypt.hash(password, 12)
            .then(hashedpassword => {
                const data = new Student({
                    name: name, email: email, mobileno: mobileno, adharno: adrno, Dob: dob, xender: xender, adminId: req.user,
                    password: hashedpassword
                });
                return data.save();
            }).then(result => {
                res.redirect('/admin/index');
            })
    }).catch(err => console.log(err));

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
    });
}



exports.getaddmarksheet = (req, res, next) => {
    const studentid = req.params.studentid;
    Student.findById(studentid).then(data => {
        res.render('admin/addmarksheet', { pagetitle: 'add marksheet', studentdata: data });
    })
    // console.log(studentid);
}
exports.postaddmarksheet = (req, res, next) => {
    const studentid = req.body.studentid;
    console.log(studentid);
    const marksheetlink = req.file;
    const std = req.body.std;
    const result = req.body.result;
    const marksheet = marksheetlink.path;
    Student.findById(studentid).then(data => {
        const updatedCartItems = [...data.cart.items];
        updatedCartItems.push({ marksheet: marksheet, std: std, result: result });
        const updatedCart = { items: updatedCartItems };
        data.cart = updatedCart;
        return data.save();
    }).then(result => {
        res.redirect('/admin/index');
    })
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
    })
}



// student edit detai funcationaly
exports.geteditprofile = (req, res, next) => {
    const editMode = req.query.edit;
    const studentid = req.params.studentid;
    Student.findById(studentid).then(data => {
        res.render("admin/addprofile", { pagetitle: 'editdetail', product: data, editing: true })
    })
}
exports.posteditprofile = (req, res, next) => {
    const studentid = req.body.studentid;
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const adrno = req.body.adharno;
    Student.findById(studentid).then(data => {
        data.name = name;
        data.email = email;
        data.mobileno = mobileno;
        data.Dob = dob
        data.xender = xender;
        data.adharno = adrno;
        return data.save();
    }).then(result => {
        console.log("product Updated");
        res.redirect('/admin/index');
    }).catch(err => { console.log(err) });
}



// const data = new Student({ name: name, email: email, mobileno: mobileno, adharno: adrno, Dob: dob, xender: xender, adminId: req.user });
//     data.save().then(result => {
//         console.log(result);
//         res.redirect('/admin/index');
//     }).catch(err => console.log(err));