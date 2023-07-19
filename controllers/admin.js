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
    const data = new Student({ name: name, email: email, mobileno: mobileno, adharno: adrno, Dob: dob, xender: xender });
    data.save().then(result => {
        console.log(result);
        res.redirect('/admin/index');
    }).catch(err => console.log(err));
};
exports.getstudent = (req, res, next) => {
    res.render('admin/searchbyid', { pagetitle: 'Search Student' })
}
exports.getstudentdetail = (req, res, next) => {
    const studentid = req.body.search;
    console.log(studentid);
    Student.findOne( {adharno:studentid}).then(studentdata => {
        if(studentdata){
            res.render('admin/updateprofile', { pagetitle: 'Update Profile', studentdata: studentdata });
        }else{
            res.render('user/invalidid',{pagetitle:'invalidid'})
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
    const marksheet = req.body.marksheetlink;
    const std = req.body.std;
    const result = req.body.result;
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
exports.getid = (req, res, next) => {
    res.render('admin/searchid', { pagetitle: 'searchid' })
}
exports.getstudentdata = (req, res, next) => {
    const studentid = req.body.search;
    // console.log(studentid);
    Student.findOne({ adharno: studentid }).then(data => {
        if( data){
            console.log(data);
            res.render('admin/viewprofile', { pagetitle: 'All detail', detail: data })
        }
        else{
            res.render('user/invalidid', { pagetitle: 'invalid id'})
        }
    })
}

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
    Student.findById(studentid).then(data=>{
        data.name=name;
        data.email=email;
        data.mobileno=mobileno;
        data.Dob=dob
        data.xender=xender;
        data.adharno=adrno;
        return data.save();
    }).then(result=>{
        console.log("product Updated");
        res.redirect('/admin/index');
    }).catch(err=>{console.log(err)});
}