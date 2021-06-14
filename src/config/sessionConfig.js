const db = require('./dbConnection').db;
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session)

const storeOptions = {
	host: process.env.DBHOST,
	port: process.env.DBPORT,
	user: process.env.DBUSER,
	password: process.env.DBPASSWORD,
	database: process.env.DBNAME,
	clearExpired: true,
	checkExpirationInterval: 1000 * 60 * 30	// 30 MINS
}

const sessionStore = new MySQLStore(storeOptions, db)

const sessionConfig = session({
	secret: process.env.SESSIONSECRET,
	resave: false,  
	saveUninitialized: false,
	store: sessionStore,
	cookie: {
		maxAge: 1000 * 60 * 60 * 5,	//5H
		path: '/',
		httpOnly: true,
		secure: false
	}
})

module.exports = sessionConfig