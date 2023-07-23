const Student = require('../models/student');

exports.getindex = (req, res, next) => {
    res.render('user/index', { pagetitle: 'home' });
}

exports.getdetail = (req, res, next) => {
    const studentid = req.session.user.adharno
    Student.findOne({ adharno: studentid }).then(data => {
        res.render('user/viewprofile', { pagetitle: 'View Profile', detail: data })
    })
}
// console.log(data);
// console.log(req.session.user.adharno);
// exports.getstudentid=(req,res,next)=>{
//     res.render('user/searchid',{pagetitle:'Serch id'})
// }