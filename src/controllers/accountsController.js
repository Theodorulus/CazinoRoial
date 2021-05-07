var db = require('../modules/dbConnection.js').db;
const bcrypt = require('bcrypt');

const login = async function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    db.query('SELECT * FROM users WHERE email = ?',email, async function (error, results, fields) {
     
      if (error) {
        res.status(400);
        res.render("home/index",{
          "code":400,
          "errorLogin":"error ocurred or user does not exist"
        } )
      }else{
        if(results.length >0){
          const comparision = await bcrypt.compare(password, results[0].Password);
          if(comparision){
            res.status(200);
              res.render("home/index", {
                "code":200,
                "loggedIn":true,
                "username": results[0].Username,
                "email": results[0].Email
              })
              
          }
          else{
            res.status(204);
            res.render("home/index",{
              "code":204,
              "errorLogin":"Email and password does not match"
             })
          }
        }
        else{
          res.status(206);
          res.render("home/index",{
            "code":206,
            "errorLogin":"Email does not exits"
            })
        }
      }
      });
  }

const register = async function(req,res){

    const password = req.body.password;

    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    var user =[
       String(req.body.name),
        String(req.body.email),
       String(encryptedPassword)
    ]

    db.query('INSERT INTO users(Username,Email, Password) VALUES (?,?,?)',user, function (error, results, fields) {
      if (error) {
        res.status(400);
        res.render("home/index",{
          "code":400,
          "errorRegister":"error"
        })
      } else {
        db.query('SELECT * FROM users', function(error,results,fields){
          res.status(200);
          res.render("home/index", {
            "code":200,
            "message":"user registered sucessfully"
              })
          
        })
      }
    });
  }

module.exports = {
    login, register
}