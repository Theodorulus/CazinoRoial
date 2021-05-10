const db = require('../config/dbConnection').db;

function getUserData(req, res, next){
    db.query('SELECT * FROM users WHERE id = ?', [req.session.userLoggedIn], (errUser, resultUser) => {
        if (errUser) throw errUser;
        
        req.userData = {
            username: resultUser[0].Username,
            email: resultUser[0].Email,
        }
        next()
        return
    })
}

function getUserDataIfLoggedIn(req, res, next){
    if (req.session && req.session.userLoggedIn){
        getUserData(req, res, next);
        return
    } else {
        next()
        return
    }
}

module.exports = { getUserData, getUserDataIfLoggedIn }