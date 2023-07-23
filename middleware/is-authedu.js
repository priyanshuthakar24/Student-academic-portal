module.exports=(req,res,next)=>{
    if(!req.session.isLoggedInedu){
        return res.redirect('/edu/login');
    }
    next();
}