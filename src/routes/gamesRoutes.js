const express = require('express');
const router = express.Router();
const gamesContr = require('../controllers/gamesController');

router.get('/slots', gamesContr.slots);
router.get('/roulette', gamesContr.roulette);
router.get('/poker', gamesContr.poker);
router.get('/blackjack', gamesContr.blackjack);

module.exports = router;