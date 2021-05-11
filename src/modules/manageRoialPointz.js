const db = require('../config/dbConnection').db

async function gainRP(sessionId, rp) {
    db.query(`SELECT data FROM sessions WHERE session_id = ?`, [sessionId], (error, result) => {
        if (error) {
            console.error(error);
        }
        var userId = JSON.parse(result[0].data).userLoggedIn;

        db.query(`
            UPDATE profile 
            SET RoialPointz = RoialPointz + ?
            WHERE UserId = ?`, [rp, userId], (error) => {
    
            if (error) {
                console.log(error);
            }
        })
    })
}

async function loseRP(sessionId, rp) {
    db.query(`SELECT data FROM sessions WHERE session_id = ?`, [sessionId], (error, result) => {
        if (error) {
            console.error(error);
        }
        var userId = JSON.parse(result[0].data).userLoggedIn;

        db.query(`
            UPDATE profile 
            SET RoialPointz = RoialPointz - ?
            WHERE UserId = ?`, [rp, userId], (error) => {

            if (error) {
                console.log(error);
            }
        })
    })
}

module.exports = { gainRP, loseRP }
