
exports.get404=(req,res,next)=>{
    const name = req.session.user;
    if(name){
        res.status(404).render('404',{pagetitle:'404',isAuthenticated:req.session.isLoggedIn,name:name.name});
    }else{
        res.status(404).render('404',{pagetitle:'404',isAuthenticated:req.session.isLoggedIn});
    }
}

exports.get500=(req,res,next)=>{
res.status(500).render('500',{pagetitle:'500',isAuthenticated:req.session.isLoggedIn});
}