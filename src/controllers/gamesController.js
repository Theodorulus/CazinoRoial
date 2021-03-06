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

const poker = (req, res) => {
    viewBag = {
        user: req.userData
    }
	res.render("games/poker", viewBag);
}

const blackjack = (req, res) => {
    viewBag = {
        user: req.userData
    }
	res.render("games/blackjack", viewBag);
}

module.exports = {
    slots, roulette, poker, blackjack
}