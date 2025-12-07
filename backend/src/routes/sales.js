const express = require('express');
const router = express.Router();
const controller = require('../controllers/salesController');

router.get('/', controller.getSales);

module.exports = router;
