const Student = require('../models/student')

exports.getindex = (req, res, next) => {
    res.render('admin/index', { pagetitle: 'home' });
}
exports.getnewform = (req, res, next) => {
    res.render('admin/addstudent', { pagetitle: 'New student' });
}
exports.poststudentdata = (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const mobileno = req.body.mobileno;
    const dob = req.body.dob;
    const xender = req.body.xender;
    const data = new Student({ name: name, email: email, mobileno: mobileno, Dob: dob, xender: xender });
    data.save().then(result=>{
        console.log(result);
        res.redirect('/admin/index');
    }).catch(err=>console.log(err));
};
exports.getstudent=(req,res,next)=>{
    res.render('admin/searchbyid',{pagetitle:'Search Student'})
}
exports.getstudentdetail=(req,res,next)=>{
    const studentid=req.body.search;
    Student.findById(studentid).then(studentdata=>{
        res.render('admin/editstudentdetail',{pagetitle:'add marksheet',studentdata:studentdata});
    });
}
exports.getaddmarksheet=(req,res,next)=>{
    const studentid=req.params.studentid;
    console.log(studentid);
    Student.findById(studentid).then(data=>{
        res.render('admin/addmarksheet',{pagetitle:'add marksheet',studentdata:data});
    })
    // console.log(studentid);
}
exports.postaddmarksheet=(req,res,next)=>{
    const studentid=req.body.studentid;
    console.log(studentid);
    const marksheet=req.body.marksheetlink;
    const std=req.body.std;
    const result=req.body.result;
   Student.findById(studentid).then(data=>{
    const updatedCartItems = [...data.cart.items];
    updatedCartItems.push({ marksheet: marksheet, std:std, result:result });
    const updatedCart = { items: updatedCartItems };
    data.cart = updatedCart;
    return data.save();
   }).then(result=>{
    res.redirect('/admin/index');
   })
};
exports.getid=(req,res,next)=>{
    res.render('admin/searchid',{pagetitle:'searchid'})
}
exports.getstudentdata=(req,res,next)=>{
const studentid=req.body.search;
Student.findById(studentid).then(data=>{
    res.render('admin/viewdetail',{pagetitle:'all detail',detail:data})
})
}