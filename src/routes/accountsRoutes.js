const express = require('express');
const router = express.Router();
const accountContr = require('../controllers/accountsController');


router.post('/login', accountContr.login);
router.post('/register', accountContr.register);
router.post('/logout', accountContr.logout)

module.exports = router;