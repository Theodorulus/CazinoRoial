var db = require('../config/dbConnection.js').db;
const rpManager = require('../modules/manageRoialPointz')
const bcrypt = require('bcrypt');
const fs = require("fs");
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

const profile = (req, res) => {

	let avatars = fs.readdirSync("./public/img/items/avatars");
	let hats = fs.readdirSync("./public/img/items/hats");
	avatars.sort(function(first, second){
		if(parseInt(first.substring(0, first.length-4).match(/\d+$/)[0]) > parseInt(second.substring(0, second.length-4).match(/\d+$/)[0]))
			return 1
		else return -1
	})
	hats.sort(function(first, second){
		if(parseInt(first.substring(0, first.length-4).match(/\d+$/)[0]) > parseInt(second.substring(0, second.length-4).match(/\d+$/)[0]))
			return 1
		else return -1
	})
	let avatarsPrices = []
	let hatsPrices = []

	for (avatar of avatars){
		var matches = avatar.substring(0, avatar.length-4).match(/\d+$/);
		avatarsPrices.push(100 * matches[0]);
	}

	for (hat of hats){
		var matches = hat.substring(0, hat.length-4).match(/\d+$/);
		hatsPrices.push(10 * matches[0]); 
	}

	let userItems =[]
	let itemsInUse = [null, null]

	db.query('SELECT * FROM items WHERE UserId = ?',req.session.userLoggedIn, async function (error, results, fields) {
     
		if (error) {
			console.log(error)
			res.status(500);
			return res.render("accounts/profile",{
				"code":500,
				"errorLogin":"Internal server error"
			})
		}

		for (result of results){
			userItems.push([result.name, result.category])
		}
		
		db.query('SELECT * FROM inuse WHERE UserId = ?',req.session.userLoggedIn, async function (error, results, fields) {
     
			if (error) {
				console.log(error)
				res.status(500);
				return res.render("accounts/profile",{
					"code":500,
					"errorLogin":"Internal server error"
				})
			}

			for (result of results){
				if(result.category == "hat")
					itemsInUse[0] = [result.name, result.category]
				if(result.category == "avatar")
					itemsInUse[1] =( [result.name, result.category])
			}

			viewBag = {
				user: req.userData,
				avatars: avatars,
				hats: hats,
				avatarsPrices: avatarsPrices,
				hatsPrices: hatsPrices,
				userItems: userItems,
				itemsInUse: itemsInUse
			}
			return res.render('accounts/profile', viewBag)
	
		});


	});


}

const buyItem = (req, res) => {
	const itemName = req.params.id
	const userId = req.session.userLoggedIn
	const category = String(req.params.id).substring(0, req.params.id.length-4).replace(/\d+$/, "")
	const price = req.params.price
	
	if (price==0){
		db.query('DELETE FROM items WHERE UserId = ? AND name = "box.png" LIMIT 1', [userId], error => {
			if (error) {
				console.log(error)
				return res.render('accounts/profile', {
					"code":500,
					"errorRegister":"Internal server error"
				})
			}
		})
	}


	if(req.userData.rp > price){
		db.query('INSERT INTO items(UserId, name, category) VALUES(?, ?, ?)', [userId, itemName, category], error => {
			if (error) {
				console.log(error)
				return res.render('accounts/profile', {
					"code":500,
					"errorRegister":"Internal server error"
				})
			}
			rpManager.loseRP(req.session.id, price)
			res.redirect("/accounts/profile")
		})
	}
	else{
		res.redirect('/accounts/profile')
	}
}

const useItem = (req, res) => {
	const itemName = req.params.id
	const userId = req.session.userLoggedIn
	const category = String(req.params.id).substring(0, req.params.id.length-4).replace(/\d+$/, "")

	db.query('DELETE FROM inUse WHERE UserId = ? AND category = ?;', [userId, category], error => {
		if (error) {
			console.log(error)
			return res.render('accounts/profile', {
				"code":500,
				"errorRegister":"Internal server error"
			})
		}
		
		db.query('INSERT INTO inUse(UserId, category, name) VALUES(?, ?, ?)', [userId, category, itemName], error => {
			if (error) {
				console.log(error)
				return res.render('accounts/profile', {
					"code":500,
					"errorRegister":"Internal server error"
				})
			}
	
			res.redirect("/accounts/profile")
		})

	})
}

module.exports = {
    login_get, register_get, logout, login_post, register_post, profile, buyItem, useItem
}