const db = require('../config/dbConnection').db

async function gainRPbyUserId(userId, rp) {
    db.query(`
        UPDATE profile 
        SET RoialPointz = RoialPointz + ?
        WHERE UserId = ?`, [rp, userId], (error) => {

        if (error) {
            console.log(error);
        }
    })
}

async function gainRPbySession(sessionId, rp) {
    db.query(`SELECT data FROM sessions WHERE session_id = ?`, [sessionId], (error, result) => {
        if (error) {
            console.error(error);
        }
        var userId = JSON.parse(result[0].data).userLoggedIn;

        gainRPbyUserId(userId, rp)
    })
}

async function loseRPbyUserId(userId, rp) {
    db.query(`
        UPDATE profile 
        SET RoialPointz = RoialPointz - ?
        WHERE UserId = ?`, [rp, userId], (error) => {

        if (error) {
            console.log(error);
        }
    })
}

async function loseRPbySession(sessionId, rp) {
    db.query(`SELECT data FROM sessions WHERE session_id = ?`, [sessionId], (error, result) => {
        if (error) {
            console.error(error);
        }
        var userId = JSON.parse(result[0].data).userLoggedIn;

        loseRPbyUserId(userId, rp)
    })
}

async function addPokerHandWon(userId) {
    db.query('UPDATE profile SET PokerHandsWon = PokerHandsWon + 1 WHERE UserId = ?', [userId], (error) => {
        if (error){
            console.log(error)
        }
    })
}

async function addPokerHandPlayed(userId) {
    db.query('UPDATE profile SET PokerHandsPlayed = PokerHandsPlayed + 1 WHERE UserId = ?', [userId], (error) => {
        if (error){
            console.log(error)
        }
    })
}



module.exports = { gainRPbySession, gainRPbyUserId, loseRPbySession, loseRPbyUserId, addPokerHandPlayed, addPokerHandWon }
