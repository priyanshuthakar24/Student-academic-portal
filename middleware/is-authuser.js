module.exports=(req,res,next)=>{
    if(!req.session.isLoggedInuser){
        return res.redirect('/login');
    }
    next();
}