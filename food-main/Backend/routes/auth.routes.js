const express = require('express');
const { signin, signup } = require('../controllers/auth.controller'); // Ensure correct import
const router = express.Router();

router.post('/signin', signin);
router.post('/signup', signup);

module.exports = router;
