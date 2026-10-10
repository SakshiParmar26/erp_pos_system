const pool = require('../config/db');
const argon2 = require('argon2');
const path = require("path");
const employeeValidator = require('../validator/employeeValidator');
const contactValidator = require('../validator/contactValidator.js');
const { object } = require('zod');
const { error } = require('console');


//Get single Employee
const getSingleEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const [rows] = await pool.query(`SELECT
            f.franchise_code,
            e.first_name,
            e.last_name,
            e.username,
            r.role_name,
            e.employee_number,
            e.email,
            c.phone,
            e.address,
            e.city,
            e.district,
            e.state,
            e.country,
            e.pincode,
            e.dob,
            e.gender,
            e.joining_date
            FROM employees e
            INNER JOIN roles r ON e.role_id = r.id
            INNER JOIN franchises f ON e.franchise_id = f.id
            LEFT JOIN contacts c ON e.id = c.employee_id
            WHERE status_id=1 AND e.id=?`, [employeeId]);
        return res.status(200).json({ rows });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Get all employee
const getAllEmployee = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const [rows] = await pool.query(`SELECT
            f.franchise_code,
            e.first_name,
            e.last_name,
            e.username,
            r.role_name,
            e.employee_number,
            e.email,
            c.phone,
            e.address,
            e.city,
            e.district,
            e.state,
            e.country,
            e.pincode,
            e.dob,
            e.gender,
            e.joining_date
            FROM employees e
            INNER JOIN roles r ON e.role_id = r.id
            INNER JOIN franchises f ON e.franchise_id = f.id
            LEFT JOIN contacts c ON e.id = c.employee_id
            WHERE status_id=1`, [employeeId]);
        return res.status(200).json({ rows });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Get employee profile image 
const getProfileImage = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await pool.query(`SELECT profile_image FROM employees WHERE id=?`, [id]);
        if (!rows.length || !rows[0].profile_image) {
            return res.status(404).json({
                error: "Profile image not found"
            });
        }
        const filePath = path.join(
            process.cwd(),
            "src",
            rows[0].profile_image
        );
        res.sendFile(filePath);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

//Insert new employee with profile image
const addEmployee = async (req, res) => {
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const incomingData = { ...req.body };
        const employeeValidation = employeeValidator.safeParse(incomingData);
        if (!employeeValidation.success) {
            const errors = employeeValidation.error.issues.map(err => err.message);
            return res.status(400).json({ errors });
        }
        const {
            franchise_id,
            first_name,
            last_name,
            username,
            role_id,
            password,
            email,
            address,
            city,
            district,
            state,
            country,
            pincode,
            dob,
            gender,
            joining_date
        } = employeeValidation.data;

        const profile_image = req.file ? `upload/${req.file.filename}` : null;

        const hashedPassword = await argon2.hash(password);

        //get franchise code
        const [franchiseRows] = await connection.query(`SELECT franchise_code FROM franchises WHERE id = ?`,
            [franchise_id]
        );
        const franchiseCode = franchiseRows[0].franchise_code;

        //get last employee of that franchise
        const [employeeRows] = await connection.query(`SELECT employee_number FROM employees WHERE franchise_id = ? ORDER BY id DESC LIMIT 1`,
            [franchise_id]
        );

        //generate employee number
        let employee_number;
        if (employeeRows.length === 0) {
            employee_number = `${franchiseCode}-EMP0001`;
        } else {
            const lastNumber = employeeRows[0].employee_number;
            const sequence = parseInt(lastNumber.split("EMP")[1]);

            employee_number = `${franchiseCode}-EMP${String(sequence + 1).padStart(4, 0)}`;
        }


        const contactValidation = contactValidator.safeParse(incomingData);
        if (!contactValidation.success) {
            const errors = contactValidation.error.issues.map(err => err.message);
            return res.status(400).json({ errors });
        }

        const { phone, status_id } = contactValidation.data;

        const sql = `INSERT INTO employees (
            franchise_id,
            first_name,
            last_name,
            username,
            role_id,
            employee_number,
            password,
            email,
            address,
            city,
            district,
            state,
            country,
            pincode,
            dob,
            gender,
            joining_date,
            profile_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const [employeeResult] = await connection.query(sql, [
            franchise_id,
            first_name,
            last_name,
            username,
            role_id,
            employee_number,
            hashedPassword,
            email,
            address,
            city,
            district,
            state,
            country,
            pincode,
            dob ?? null,
            gender,
            joining_date,
            profile_image ?? null
        ]);
        const employeeId = employeeResult.insertId;

        await connection.query(`INSERT INTO contacts (contact_type, employee_id, company_id, franchise_id, phone, status_id) 
            VALUES (?, ?, ?, ?, ?, ?)`, [
            "Employee",
            employeeId,
            null,
            null,
            phone,
            status_id
        ]);

        await connection.commit();
        return res.status(201).json({ message: 'Record inserted successfully.' });
    }
    catch (error) {
        if (connection) {
            await connection.rollback();
        }

        return res.status(500).json({
            error: error.message
        });
    }
    finally {
        if (connection) {
            connection.release();
        }
    }
};

//Change password
const changePassword = async (req, res) => {
    try {

        const employeeId = req.employee.employeeId;
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({ message: 'Old password and new password are required.' });
        }
        const [rows] = await pool.query(`SELECT password FROM employees WHERE id=?`, [employeeId]);

        if (rows.length === 0) {
            return res.status(400).json({ message: 'Employee not found.' });
        }

        const isMatch = await argon2.verify(rows[0].password, oldPassword);

        if (!isMatch) {
            return res.status(400).json({ message: 'Old password is incorrect.' });
        }

        const hashedPassword = await argon2.hash(newPassword);

        await pool.query(`UPDATE employees SET password=? WHERE id=?`, [hashedPassword, employeeId]);

        return res.status(200).json({ message: 'Password changed successfully.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

};

//Update employee
const updateEmployee = async (req, res) => {
    const id = req.params;
    try {
        const updateSchema = employeeValidator.partial();
        const validation = updateSchema.safeParse(req.body);

        if (!validation.success) {
            const error = validation.error.issues.map(err => err.message);
            return res.status(400).json({ error: error});
        }

        const data = { ...validation.data };

        const fields = Object.keys(data);
        if (fields.length === 0) {
            return res.status(400).json({ error: "No fields are provided for update." });
        }
        const setClause = fields
            .map(fields => `${fields}=?`)
            .join(", ");

        const values = fields.map(fields => data[fields]);
        values.push(id);

        const [result] = await pool.query(`UPDATE employees SET ${setClause} WHERE id=?`, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Record not found.' });
        }

        return res.status(200).json({ message: 'Record updated successfully.' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = { getSingleEmployee, getAllEmployee, getProfileImage, addEmployee, changePassword, updateEmployee };