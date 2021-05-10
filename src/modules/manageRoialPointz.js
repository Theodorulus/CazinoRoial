const db = require('../config/dbConnection').db

async function gainRP(userId, rp) {
    db.query(`
        UPDATE profile 
        SET RoialPointz = RoialPointz + ?
        WHERE UserId = ?`, [rp, userId], (error) => {

        if (error) {
            console.log(error);
        }
    })
}

async function loseRP(userId, rp) {
    db.query(`
        UPDATE profile 
        SET RoialPointz = RoialPointz - ?
        WHERE UserId = ?`, [rp, userId], (error) => {

        if (error) {
            console.log(error);
        }
    })
}

module.exports = { gainRP, loseRP }
