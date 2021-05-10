const db = require('../config/dbConnection').db;

const getUserDataQuery = `
    SELECT u.Username, u.Email, p.RoialPointz
    FROM users u join profile p on(u.id = p.UserId)
    WHERE u.id = ?
`

function getUserData(req, res, next){
    db.query(getUserDataQuery, [req.session.userLoggedIn], (errUser, resultUser) => {
        if (errUser) throw errUser;
        
        req.userData = {
            username: resultUser[0].Username,
            email: resultUser[0].Email,
            rp: resultUser[0].RoialPointz
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