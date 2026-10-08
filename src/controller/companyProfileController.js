const pool = require("../config/db");
const companyValidator=require("../validator/companyValidator.js");
const {contactValidator}=require("../validator/contactValidator.js");

//Get company details
const getCompanyProfile=async (req,res) => {
    try {
        const [rows]=await pool.query(`SELECT
            c.company_code,
            c.company_name,
            c.company_logo,
            c.tagline,
            c.legal_name,
            c.short_name,
            c.gst_number,
            c.pan_number,
            c.cin_number,
            c.company_email,
            c.website,
            co.phone,
            c.address_line1,
            c.address_line2,
            c.city,
            c.district,
            c.state,
            c.country,
            c.pincode,
            c.financial_year_start,
            c.financial_year_end,
            c.office_start_time,
            c.office_end_time,
            c.working_days_start,
            c.working_days_end,
            e.first_name AS created_by,
            r.role_name AS created_by_role
            FROM company_profile c
            INNER JOIN employees e ON c.created_by = e.id
            INNER JOIN roles r ON e.role_id = r.id
            LEFT JOIN contacts co ON c.id = co.company_id`);

            return res.status(200).json({rows});
    } catch (error) {
        return res.status(500).json({error:error.message});
    }
};
module.exports={getCompanyProfile};