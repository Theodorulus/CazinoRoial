const express = require('express');
const router = express.Router();
const loginContr = require('../controllers/accountsController');

router.post('/login', loginContr.login);
router.post('/register', loginContr.register);

module.exports = router;