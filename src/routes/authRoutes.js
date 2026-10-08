const { login, logout } = require('../controller/auth/authController.js');
const express = require("express");
const { authentication } = require("../middleware/authentication.js");

const router = express.Router();

router.post('/login', login);
router.post('/logout', authentication, logout);

module.exports = router;