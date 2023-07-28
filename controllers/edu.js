const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
const Student = require('../models/student');
exports.getIndex = (req, res, next) => {
    res.render('education/index', { pagetitle: 'edu Home' });
}
exports.getaddinstitute = (req, res, next) => {
    res.render('education/addinstitute', { pagetitle: 'add Institute' });
}
exports.postinstitute = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const mobileno=req.body.mobileno;
    const indexno=req.body.indexno;
    const name=req.body.name;
    const confirmpassword = req.body.confirmpassword;
    Admin.findOne({ email: email }).then(adminDoc => {
        if (adminDoc) {
            res.redirect('/edu/addinstitute');
        }
        return bcrypt.hash(password, 12)
            .then(hashedpassword => {
                const admin = new Admin({
                    email: email,
                    name:name,
                    mobileno:mobileno,
                    indexno:indexno,
                    password: hashedpassword
                });
                return admin.save();
            }).then(result => {
                res.redirect('/edu/index');
            })
    }).catch(err => console.log(err));
};

exports.getsearchid=(req,res,next)=>{
    // const searchid=req.body.search;
    let message = req.flash('error');
    if (message.length > 0) {
        message = message[0];
    } else {
        message = null;
    }
    // res.render('admin/searchid', { pagetitle: 'searchid' })
    res.render('education/searchid',{pagetitle:'delet marksheet', errormessage: message});
}
exports.postsearchid=(req,res,next)=>{
    const studentid = req.body.search;
    // console.log(studentid);
    Student.findOne({ adharno: studentid }).then(data => {
        if (data) {
            console.log(data);
            res.render('education/deletemarksheet', { pagetitle: 'All detail', detail: data })
        }
        else {
            req.flash('error', 'Id Dose not Found');
            res.redirect('/edu/searchid');
        }
    })
}
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const adharno=req.body.adharno;
    console.log(prodId);
    Student.findOne({adharno:adharno}).then(data=>{
        const updatedCartItems = data.cart.items
        updatedCartItems.filter(item => {
            return item.std !== prodId;
        });
        data.cart.items = updatedCartItems;
        return data.save()
        }).then(result=>{
        res.redirect('/edu/index');
    });
    };
