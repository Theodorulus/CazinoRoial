

const index = (req, res) => {
    viewBag = {
        user: "Euglen"
    }
    return res.render('home/index', viewBag)
}

const notFound = (req, res) => {
	res.status(404).render("home/404");
}

module.exports = {
    index, notFound
}