const express = require('express');
const router = express.Router();
const accountContr = require('../controllers/accountsController');

router.get('/login', accountContr.login_get)
router.get('/register', accountContr.register_get)

router.post('/login', accountContr.login_post);
router.post('/register', accountContr.register_post);
router.post('/logout', accountContr.logout)

module.exports = router;