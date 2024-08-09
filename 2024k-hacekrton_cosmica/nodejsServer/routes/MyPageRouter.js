const express = require('express');
const router = express.Router();
const UserData  = require('../controllers/UserData');

router.route('/User')
.get(UserData)

module.exports = router