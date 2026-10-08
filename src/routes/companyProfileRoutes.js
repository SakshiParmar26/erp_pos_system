const express = require("express");
const { authentication } = require("../middleware/authentication.js");
const { getCompanyProfile } = require("../controller/companyProfileController.js");

const router = express.Router();

router.get('/', authentication, getCompanyProfile);

module.exports = router;