const bcrypt = require('bcryptjs');
const Student = require('../models/student');
const Document = require('../models/document');
const { validationResult } = require('express-validator');
// const crypto=require('../util/ency');
// encryption of image 
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
// / *-*-*-*-*


exports.getindex = (req, res, next) => {
    const name = req.session.user;
    res.render('admin/index', { pagetitle: 'home', name: name.name });
}


exports.getnewform = (req, res, next) => {
    const name = req.session.user;
    const editMode = req.query.edit;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }
    res.render('admin/addprofile', { pagetitle: 'New student', editing: editMode, errormessage: message, olddata: { name: "", mobileno: '', dob: '', xender: 'Male', adharno: '', email: '', password: '' }, name: name.name });
}


exports.poststudentdata = (req, res, next) => {
    const name1 = req.session.user;
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const create_year = req.body.create_year;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const adrno = req.body.adharno;
    const password = req.body.password;
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        console.log(xender);
        return res.status(402).render('admin/addprofile', { pagetitle: 'Add Profile', path: '/admin/addprofile', editing: false, errormessage: errors.array()[0].msg, name: name1.name, olddata: { name: name, mobileno: mobileno, ct_year: create_year, dob: dob, xender: xender, adharno: adrno, email: email, password: password } })
    }
    console.log(req.user);
    Student.findOne({ email: email }).then(adminDoc => {

        bcrypt.hash(password, 12)
            .then(hashedpassword => {
                const data = new Student({
                    name: name, email: email, mobileno: mobileno, ct_year: create_year, adharno: adrno, Dob: dob, xender: xender, adminId: req.user,
                    password: hashedpassword
                });
                return data.save();
            }).then(result => {
                res.redirect('/admin/index');
            })
    }).catch(err => {
        console.log(err);
    });

};


exports.getstudent = (req, res, next) => {
    const name = req.session.user;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/searchbyid', { pagetitle: 'Search Student', errormessage: message, name: name.name })
}

exports.getstudentdetail = (req, res, next) => {
    const name = req.session.user;
    const adminid = req.session.user._id;
    const studentid = req.body.search;
    console.log(studentid);
    Student.findOne({ adminId: adminid, adharno: studentid }).then(studentdata => {
        if (!studentdata) {
            req.flash('error', 'Id Dose not Found');
            res.redirect('/admin/editstudent');
        } else {
            // const adminid=studentdata.adminId.toString();
            console.log(studentdata.adminId);
            console.log(req.user._id);
            if (studentdata.adminId.toString() === req.user._id.toString()) {
                res.render('admin/updateprofile', { pagetitle: 'Update Profile', studentdata: studentdata, name: name.name });
            } else {
                req.flash('error', "You can't access this id");
                res.redirect('/admin/editstudent');
            }
        }
    }).catch(err => {
        console.log(err);
    });
}



exports.getaddmarksheet = (req, res, next) => {
    const name = req.session.user;
    const studentid = req.params.studentid;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }
    Student.findById(studentid).then(data => {
        console.log(data._id);
        res.render('admin/addmarksheet', { pagetitle: 'add marksheet', studentdata: data, errormessage: message, olddata: { marksheet: "", std: "", result: "Pass", studentid: data._id }, name: name.name });
    }).catch(err => {
        console.log(err);
    });
    // console.log(studentid);
}


exports.postaddmarksheet = (req, res, next) => {
    const name = req.session.user;
    const studentid = req.body.studentid;
    // console.log(studentid);
    const marksheetlink = req.file;
    const marksheet = req.body.marksheetlink;
    // console.log(marksheet);
    const std = req.body.std;
    const result = req.body.result; 
    // encrypt the message with the specified input encoding and give output in specified output encoding.
    const cipher = crypto.createCipheriv(algorithm,process.env.key, process.env.iv);
    let encryptedData = cipher.update(marksheet, "utf8", "hex");
    encryptedData += cipher.final("hex");

    // console.log("Encrypted message: " + encryptedData);
    // const marksheet = marksheetlink.path;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(402).render('admin/addmarksheet', { pagetitle: 'Add Profile', path: '/admin/addmarksheet', errormessage: errors.array()[0].msg, olddata: { marksheet: encryptedData, std: std, result: result, studentid: studentid }, name: name.name })
    }
    Student.findById(studentid).then(data => {
        const updatedCartItems = [...data.cart.items];
        updatedCartItems.push({ marksheet: encryptedData, std: std, result: result });
        const updatedCart = { items: updatedCartItems };
        data.cart = updatedCart;
        return data.save();
    }).then(result => {
        res.redirect('/admin/index');
    }).catch(err => {
        console.log(err);
    });
};






exports.getid = (req, res, next) => {
    const name = req.session.user;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    res.render('admin/searchid', { pagetitle: 'searchid', errormessage: message, name: name.name })
}


exports.getstudentdata = (req, res, next) => {
    const name = req.session.user;
    const studentid = req.body.search;
    // console.log(studentid);
    Student.findOne({ adharno: studentid }).then(data => {
        if (data) {
            const newarr = []

            for (let data1 of data.cart.items) {
                // console.log(data1);
                const decipher = crypto.createDecipheriv(algorithm, process.env.key, process.env.iv);
                decrypted = decipher.update(data1.marksheet, 'hex', 'utf8');
                newarr.push(decrypted += decipher.final('utf8'))
                // newarr.push(data.cart.items.std);
            }
            // console.log("Decrypted message: " + newarr);

            res.render('admin/viewprofile', { pagetitle: 'All detail', detail: data, name: name.name, dect: newarr });
        }
        else {
            req.flash('error', 'Id Dose not Found');
            res.redirect('/admin/viewdetail');
        }
    }).catch(err => {
        console.log(err);
    });
}



// student edit detai funcationaly
exports.geteditprofile = (req, res, next) => {
    const name = req.session.user;
    const editMode = req.query.edit;
    const studentid = req.params.studentid;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null
    }
    Student.findById(studentid).then(data => {
        res.render("admin/addprofile", { pagetitle: 'editdetail', product: data, editing: true, errormessage: message, name: name.name, olddata: { name: "", mobileno: '', dob: '', xender: 'Male', adharno: '', email: '', password: '' } })
    }).catch(err => {
        console.log(err);
    });
}
exports.posteditprofile = (req, res, next) => {
    const name1 = req.session.user;
    const studentid = req.body.studentid;
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const create_year = req.body.create_year;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const adrno = req.body.adharno;
    const password = req.body.password;
    const errors = validationResult(req);
    let pass;
    if (!errors.isEmpty()) {
        console.log(xender);
        return res.status(402).render('admin/addprofile', { pagetitle: 'Add Profile', path: '/admin/addprofile', editing: true, errormessage: errors.array()[0].msg, product: { name: name, mobileno: mobileno, create_year: create_year, Dob: dob, xender: xender, adharno: adrno, email: email, password: password }, name: name1.name })
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
            pass.ct_year = create_year;
            pass.Dob = dob
            pass.xender = xender;
            pass.adharno = adrno;
            pass.password = hashedpassword;
            return pass.save();
        }).then(result => {
            console.log("product Updated");
            res.redirect('/admin/index');
        }).catch(err => {
            console.log(err);
        });
        // console.log(hashedpassword);
        // data.password = hashedpassword
    }
}


exports.postdocument = (req, res, next) => {
    const studentid = req.body.studentid;
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const adharno = req.body.adharno
    const documenttype = req.body.document;
    const description = req.body.description;
    const adminid = req.body.adminid;
    const data = new Document({ name: name, email: email, mobileno: mobileno, Dob: dob, adharno: adharno, xender: xender, adminId: adminid, documenttype: documenttype, description: description });
    return data.save().then(result => {
        res.redirect('/');
    }).catch(err => {
        console.log(err);
    });
}

exports.getrequestdocument = (req, res, next) => {
    const name = req.session.user;
    const id = req.session.user._id
    console.log(id);

    Document.find({ adminId: id }).then(data => {
        console.log(data)
        res.render("admin/documentlist", { pagetitle: 'document list', list: data, name: name.name })
    })
}
exports.postrequestdocument = (req, res, next) => {
    const name = req.session.user;
    const id = req.session.user._id;
    const adharno = req.body.adharno;
    const docid = req.body.productId;
    Document.find({ adminId: id, adharno: adharno }).then(data => {
        res.render("admin/documentinfo", { pagetitle: 'document list', list: data, name: name.name })
    })
}
exports.postdelete = (req, res, next) => {
    const id = req.body.productId;
    console.log(id);
    Document.deleteOne({ _id: id }).then(result => {
        res.redirect('/admin/requestdocument');
    })

}
// const data = new Student({ name: name, email: email, mobileno: mobileno, adharno: adrno, Dob: dob, xender: xender, adminId: req.user });
//     data.save().then(result => {
//         console.log(result);
//         res.redirect('/admin/index');
//     }).catch(err => console.log(err));
// exports.postaddmarksheet = (req, res, next) => {
//     const name = req.session.user;
//     const studentid = req.body.studentid;
//     console.log(studentid);
//     const marksheet = req.body.marksheet;
//     const std = req.body.std;
//     const result = req.body.result;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//         return res.status(402).render('admin/addmarksheet', { pagetitle: 'Add Profile', path: '/admin/addmarksheet', errormessage: errors.array()[0].msg, olddata: { marksheet: marksheet, std: std, result: result, studentid: studentid }, name: name.name })
//     }
//     Student.findById(studentid).then(data => {
//         const updatedCartItems = [...data.cart.items];
//         updatedCartItems.push({ marksheet: markshet, std: std, result: result });
//         const updatedCart = { items: updatedCartItems };
//         data.cart = updatedCart;
//         return data.save();
//     }).then(result => {
//         res.redirect('/admin/index');
//     }).catch(err => {
//         console.log(err);
//     })
// };.