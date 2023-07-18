const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
app.set('view engine','ejs');
app.set('views','views');
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:false}));
const errorcontroller=require('./controllers/error');

const adminroute=require('./routes/admin');
const studentroute=require('./routes/user');
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin',adminroute);
app.use(studentroute);
app.use(errorcontroller.get404);
mongoose.connect('mongodb+srv://priyanshuthakar24:%40pinku24@cluster0.c77xwlg.mongodb.net/datacollection').then(result=>{
    app.listen(3003);
}).catch(err=>{console.log(err)})