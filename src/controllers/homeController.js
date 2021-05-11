const index = (req, res) => {
    viewBag = {
        user: req.userData
    }
    return res.render('home/index', viewBag)
}

const notFound = (req, res) => {
    viewBag = {
        user: req.userData
    }
	res.status(404).render("home/404", viewBag);
}

module.exports = {
    index, notFound
}