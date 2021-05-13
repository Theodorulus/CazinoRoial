var db = require('../config/dbConnection.js').db;
const bcrypt = require('bcrypt');

// dupa login/register (post) cu succes de obicei trebuie redirect catre pagina principala
// in caz de eroare randam aceeasi pagina cu info despre eroare

// TO DO: de modificat rutele din home/index in accounts/login, accounts/register

const login_get = (req, res) => {
	res.render('accounts/login');
}

const register_get = (req, res) => {
	res.render('accounts/register');
}

const logout = (req, res) => {
	if (req.session && req.session.userLoggedIn){
		req.session.destroy();
	} 
	res.redirect('/')
}

const login_post = async function(req,res){
    var email= req.body.email;
    var password = req.body.password;
    db.query('SELECT * FROM users WHERE email = ?',email, async function (error, results, fields) {
     
		if (error) {
			console.log(error)
			res.status(500);
			return res.render("accounts/login",{
				"code":500,
				"errorLogin":"Internal server error"
			})
		}

		if(results.length === 0) {
			res.status(206);
			return res.render("accounts/login",{
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
				return res.render("accounts/login",{
					"code":204,
					"errorLogin": "Email and password does not match"
				})
			}
		} catch (error) {
			console.log(error)
			res.status(500);
			return res.render("accounts/login",{
				"code":500,
				"errorLogin":"Internal server error"
			})
		}
	});
}

const register_post = async function(req,res){
    const password = req.body.password;
	const confirm_pass = req.body.confirm_pass;
	console.log(password, confirm_pass)

	if (password !== confirm_pass){
		return res.render("accounts/register", {
			"errorRegister": "Passwords do not match."
		})
	}

	try {
		const salt = bcrypt.genSaltSync(10);
		const encryptedPassword = await bcrypt.hash(password, salt);
		var user =[
			String(req.body.username),
			String(req.body.email),
			String(encryptedPassword)
		]
	
		db.query('INSERT INTO users(Username, Email, Password) VALUES (?,?,?)',user, function (error, results, fields) {
			if (error) {
				res.status(500);
				return res.render("accounts/register",{
					"code":500,
					"errorRegister":"Internal server error"
				})
			}
					
			// CREARE PROFIL (AUTOMAT)
			const userId = results.insertId;
			db.query('INSERT INTO profile(UserId, Phone, Birthdate) VALUES(?, ?, ?)', [userId, req.body.phone, req.body.data], error => {
				if (error) {
					console.log(error)
					res.status(500)
					return res.render('accounts/register', {
						"code":500,
						"errorRegister":"Internal server error"
					})
				}
				res.status(200);
				res.redirect('/')
			})
		});

	} catch (error) {
		res.status(500);
		res.render("accounts/register",{
			"code":500,
			"errorRegister":"Internal server error"
		})
	}
}

module.exports = {
    login_get, register_get, logout, login_post, register_post
}