const express = require('express');
const {
    getSingleEmployee,
    getAllEmployee,
    getProfileImage,
    addEmployee,
    changePassword
} = require('../controller/employeeController.js');
const authentication = require('../middleware/authentication.js');
const upload = require('../middleware/uploadImage.js');

const router = express.Router();

router.patch('/changePassword', authentication, changePassword);
router.get('/profileImage/:id', authentication, getProfileImage);
router.get('/', authentication, getAllEmployee);
router.get('/:id', authentication, getSingleEmployee);
router.post('/', authentication, upload.single('profile_image'), addEmployee);

module.exports = router;