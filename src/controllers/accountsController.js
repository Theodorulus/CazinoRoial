var db = require('../config/dbConnection.js').db;
const bcrypt = require('bcrypt');

// dupa login/register (post) cu succes de obicei trebuie redirect catre pagina principala
// in caz de eroare randam aceeasi pagina cu info despre eroare

// TO DO: de modificat rutele din home/index in accounts/login, accounts/register

const logout = (req, res) => {
	if (req.session && req.session.userLoggedIn){
		req.session.destroy();
	} 
	res.redirect('/')
}

const login = async function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    db.query('SELECT * FROM users WHERE email = ?',email, async function (error, results, fields) {
     
		if (error) {
			res.status(500);
			return res.render("home/index",{
				"code":500,
				"errorLogin":"Internal server error"
			})
		}

		if(results.length === 0) {
			res.status(206);
			return res.render("home/index",{
				"code":206,
				"errorLogin":"Email does not exits"
			})
		}

		try {
			const comparision = await bcrypt.compare(password, results[0].Password);
			if(comparision){
				// INITIALIZEAZA SESIUNEA
				req.session.userLoggedIn = results[0].id;
	
				res.status(200)
				res.redirect('/')
			}
			else{
				res.status(204)
				return res.render("home/index",{
					"code":204,
					"errorLogin": "Email and password does not match"
				})
			}
		} catch (error) {
			res.status(500);
			return res.render("home/index",{
				"code":500,
				"errorLogin":"Internal server error"
			})
		}
	});
}

const register = async function(req,res){
    const password = req.body.password;

	try {
		const salt = bcrypt.genSaltSync(10);
		const encryptedPassword = await bcrypt.hash(password, salt);
		var user =[
			String(req.body.name),
			String(req.body.email),
			String(encryptedPassword)
		]
	
		db.query('INSERT INTO users(Username,Email, Password) VALUES (?,?,?)',user, function (error, results, fields) {
			if (error) {
				res.status(500);
				return res.render("home/index",{
					"code":500,
					"errorLogin":"Internal server error"
				})
			}

			
			// de ce mai selectezi tot din users daca nu faci nimic cu datele?
			// db.query('SELECT * FROM users', function(error,results,fields){
				//   res.status(200);
				//   res.render("home/index", {
					//     "code":200,
					//     "message":"user registered sucessfully"
					//       })
					// })
					
			// CREARE PROFIL (AUTOMAT)
			const userId = results.insertId;
			db.query('INSERT INTO profile(UserId) VALUES(?)', [userId], error => {
				if (error) {
					console.log(error)
					res.status(500)
					return res.render('home/index', {
						"code":500,
						"errorLogin":"Internal server error"
					})
				}
				res.status(200);
				res.redirect('/')
			})
		});

	} catch (error) {
		res.status(500);
		res.render("home/index",{
			"code":500,
			"errorLogin":"Internal server error"
		})
	}
}

module.exports = {
    logout, login, register
}