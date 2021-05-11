const express = require('express');
const router = express.Router();
const homeContr = require('../controllers/homeController');

router.get('/', homeContr.index);
router.get('/404', homeContr.notFound);
router.get('/testSocket', (req, res) => {
    res.render('home/testSocket')
});

module.exports = router;