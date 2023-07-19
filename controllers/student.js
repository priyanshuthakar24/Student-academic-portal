const Student=require('../models/student');

exports.getindex=(req,res,next)=>{
    res.render('user/index',{pagetitle:'home'});
}

exports.getdetail=(req,res,next)=>{
    const studentid=req.body.search;
    Student.findOne({adharno:studentid}).then(data=>{
        res.render('user/viewprofile',{pagetitle:'View Profile',detail:data})
    })
}
exports.getstudentid=(req,res,next)=>{
    res.render('user/searchid',{pagetitle:'Serch id'})
}