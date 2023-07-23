const bcrypt = require('bcryptjs');
const Admin = require('../models/admin');
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

