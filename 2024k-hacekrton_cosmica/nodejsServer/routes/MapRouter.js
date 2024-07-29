const express = require('express0');
const router = express.Router();
const SerachLocation  = require('../controllers/SearchLocation');

router.route('/Search')
.post(SerachLocation)

module.exports = router
