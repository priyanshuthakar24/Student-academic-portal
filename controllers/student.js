const Student = require('../models/student');
const fs = require('fs');
const path = require('path');
const pdfDocument = require('pdfkit');
// encryption of image 

const crypto = require("crypto");
const algorithm = "aes-256-cbc";
// const key = "mysecretkeymysecretkeymysecretke"
// const iv = "1234567891012451"; 

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
    const ct_year = req.session.user.ct_year;
    console.log(ct_year);
    Student.findOne({ ct_year: ct_year, adharno: studentid }).then(data => {
        const newarr = []
        for (let data1 of data.cart.items) {
            // console.log(data1);
            const decipher = crypto.createDecipheriv(algorithm, process.env.key, process.env.iv);
            decrypted = decipher.update(data1.marksheet, 'hex', 'utf8');
            newarr.push(decrypted += decipher.final('utf8'))
        }

        console.log(data);
        res.render('user/viewprofile', { pagetitle: 'View Profile', detail: data, name: name.name, decryptedata: newarr })
    }).catch(err => {
        console.log(err);
    });
}



exports.getdocument = (req, res, next) => {
    const name = req.session.user;
    const studentid = req.session.user.adharno;
    const ct_year = req.session.user.ct_year;
    Student.findOne({ ct_year: ct_year, adharno: studentid }).then(data => {
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
            // console.log(imageid[0].marksheet)
            const encryptedText = imageid[0].marksheet;
            const decipher = crypto.createDecipher(algorithm, key);
            // decrypt the encrypted text
            let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
            decrypted += decipher.final('utf8');
            console.log(decrypted);
            pdfDoc.image(decrypted, 20, 15, { scale: 0.5 }).text('Marksheet', 290, 3);
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