const express = require('express');
const {
    getSingleEmployee,
    getAllEmployee,
    getProfileImage,
    addEmployee,
    changePassword,
    updateEmployee
} = require('../controller/employeeController.js');
const { authentication } = require('../middleware/authentication.js');
const { authorizeRoles } = require('../middleware/authorizeRoles.js');
const upload = require('../middleware/uploadImage.js');

const router = express.Router();

router.patch('/changePassword', authentication, changePassword);
router.get('/profileImage/:id', authentication, authorizeRoles("employees.view"), getProfileImage);
router.get('/', authentication, authorizeRoles("employees.view"), getAllEmployee);
router.get('/:id', authentication, authorizeRoles("employees.view"), getSingleEmployee);
router.post('/', authentication, upload.single('profile_image'), addEmployee);
router.put('/:id', authentication, authorizeRoles("employees.update"), updateEmployee);

module.exports = router;