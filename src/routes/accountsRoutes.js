const express = require('express');
const router = express.Router();
const accountContr = require('../controllers/accountsController');

router.get('/login', accountContr.login_get)
router.get('/register', accountContr.register_get)
router.get('/profile', accountContr.profile)

router.post('/login', accountContr.login_post);
router.post('/register', accountContr.register_post);
router.post('/logout', accountContr.logout)
router.post('/buyItem/:id/:price', accountContr.buyItem);
router.post('/useItem/:id', accountContr.useItem);



module.exports = router;