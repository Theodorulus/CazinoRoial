function redirectUnauthorizedUser(req, res, next) {
    if (req.session && req.session.userLoggedIn){
        next();
        return
    } else {
        return res.redirect('/accounts/login');
    }
}

module.exports = {redirectUnauthorizedUser}