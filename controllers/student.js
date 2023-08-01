const Student = require('../models/student');

exports.getindex = (req, res, next) => {
    const name=req.session.user;
    if(name){
        res.render('user/index', { pagetitle: 'home',name:name.name});
    }else{
        res.render('user/index', { pagetitle: 'home' });
    }
}

exports.getdetail = (req, res, next) => {
    const name=req.session.user;
    const studentid = req.session.user.adharno
    Student.findOne({ adharno: studentid }).then(data => {
        res.render('user/viewprofile', { pagetitle: 'View Profile', detail: data ,name:name.name})
    }).catch(err => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error);
    });
}

exports.getimage=(req,res,next)=>{
    res.render('user/slider', { pagetitle: 'home' });
}
// console.log(data);
// console.log(req.session.user.adharno);
// exports.getstudentid=(req,res,next)=>{
//     res.render('user/searchid',{pagetitle:'Serch id'})
// }