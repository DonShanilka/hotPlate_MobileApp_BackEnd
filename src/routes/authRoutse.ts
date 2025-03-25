const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/auth/saveAuth', authController.addAuth);
router.post('/auth/updateAuth', authController.updateAuth);