const authRoutes=require('../routes/authRoutes.js');
const employeeRoutes= require('../routes/employeeRoutes.js');
const companyProfileRoutes=require('../routes/companyProfileRoutes.js');
const express = require('express');

const router = express.Router();

router.use('/auth',authRoutes);
router.use('/employees',employeeRoutes);
router.use('/company_profile',companyProfileRoutes);

module.exports=router;