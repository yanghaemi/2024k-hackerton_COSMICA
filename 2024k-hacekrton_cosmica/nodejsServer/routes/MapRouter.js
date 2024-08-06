const express = require('express');
const router = express.Router();
const SerachLocation  = require('../controllers/SearchLocation');

router.route('/Search')
.post(SerachLocation)

module.exports = router
