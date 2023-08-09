const Student = require('../models/student');
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');

exports.getindex = (req, res, next) => {
    const name = req.session.user;
    if (name) {
        res.render('user/index', { pagetitle: 'home', name: name.name });
    } else {
        res.render('user/index', { pagetitle: 'home' });
    }
}

exports.getdetail = (req, res, next) => {
    const name = req.session.user;
    const studentid = req.session.user.adharno
    Student.findOne({ adharno: studentid }).then(data => {
        res.render('user/viewprofile', { pagetitle: 'View Profile', detail: data, name: name.name })
    }).catch(err => {
        console.log(err);
    });
}



exports.getdocument = (req, res, next) => {
    const name = req.session.user;
    const studentid = req.session.user.adharno
    Student.findOne({ adharno: studentid }).then(data => {
        res.render('user/document', { pagetitle: 'View Profile', product: data, name: name.name })
    }).catch(err => {
        console.log(err);
    });
}


exports.getimage = (req, res, next) => {
    const studentid = req.body.studentid;
    const marksheetid = req.body.marksheetid;
    console.log(marksheetid);
    Student.findById(studentid).then(data => {
        if (!data) { return next() }
        if (data._id.toString() !== req.session.user._id.toString()) { return next() }
        else {
            const marksheetName = "marksheet" + marksheetid + '.pdf';
            const marksheetpath = path.join('data', 'marksheet', marksheetName);
            const pdfDoc = new pdfDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment;filename="' + marksheetName + '"');
            pdfDoc.pipe(fs.createWriteStream(marksheetpath));
            pdfDoc.pipe(res);
            pdfDoc.text('Marksheet');
            const imageid = data.cart.items.filter(item => {
                return item._id.toString() === marksheetid.toString()
            })
            pdfDoc.image(imageid[0].marksheet, 20, 15, { scale: 0.5 }).text('Marksheet', 290, 3);
            pdfDoc.end();
        }
    }).catch(err => {
        console.log(err);
    })

}


    // const name = req.session.user;
    // const userid = req.session._id
    // console.log(userid);
    // Student.findById(userid).then(data => {
    //     res.render('user/documentrequest', { pagetitle: 'document', product: data, name: name.name });
    // }).catch(err => {
    //     console.log(err);
    // })
// console.log(data);
// console.log(req.session.user.adharno);
// exports.getstudentid=(req,res,next)=>{
//     res.render('user/searchid',{pagetitle:'Serch id'})
// }