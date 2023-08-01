
exports.get404=(req,res,next)=>{
res.status(404).render('404',{pagetitle:'404',isAuthenticated:req.session.isLoggedIn});
}

exports.get500=(req,res,next)=>{
res.status(500).render('500',{pagetitle:'500',isAuthenticated:req.session.isLoggedIn});
}