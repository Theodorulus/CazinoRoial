const slots = (req, res) => {
    viewBag = {
        user: req.userData
    }
    return res.render('games/slots', viewBag)
}

const roulette = (req, res) => {
    viewBag = {
        user: req.userData
    }
	res.render("games/roulette", viewBag);
}

module.exports = {
    slots, roulette
}