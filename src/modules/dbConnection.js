var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : process.env.DBPASSWORD,
  database : process.env.DB
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