var mysql = require('mysql');
var connection = mysql.createConnection({
    host     : process.env.DBHOST,
    user     : process.env.DBUSER,
    password : process.env.DBPASSWORD,
    database : process.env.DBNAME
});

connection.connect(function(err){
	if(!err) {
		console.log("Database is connected!");
	} else {
		console.log("Error connecting database!");
		console.log(err)
	}
});

module.exports.db = connection;