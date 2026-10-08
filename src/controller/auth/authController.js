const { authValidator } = require('../../validator/authValidator.js');
const pool = require('../../config/db.js');
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

//Login
const login = async (req, res) => {
    const validation = authValidator.safeParse(req.body);
    if (!validation.success) {
        const errorMessages = validation.error.issues.map(err => err.message);
        return res.status(400).json({ error: errorMessages });
    }
    const { username, password } = validation.data;
    try {
        const [rows]=await pool.query(`SELECT 
            e.id,
            e.role_id,
            e.first_name, 
            e.last_name, 
            e.username,
            e.employee_number, 
            e.email, 
            e.password,
            e.address,
            e.city,
            e.district,
            e.state,
            e.country,
            e.pincode,
            e.dob, 
            e.gender,
            e.joining_date ,
            r.role_name
            FROM employees e
            INNER JOIN roles r ON e.role_id=r.id
            WHERE e.username=?`,[username]);
            
        if(rows.length===0)
        {
            return res.status(401).json({error:'Invalid credentials.'});
        }
        const employee=rows[0];

        const isMatch=await argon2.verify(employee.password,password);
        if(!isMatch){
            return res.status(401).json({error:'Invalid credentials.'});
        }

        const [permissionRows] = await pool.query(`SELECT
            p.permission_name
            FROM permissions p
            INNER JOIN role_permissions rp ON p.id=rp.permission_id
            WHERE rp.role_id=?`,
            [employee.role_id]
        );

        const permissions = permissionRows.map(
            item => item.permission_name
        );

        const token=jwt.sign({
            employeeId:employee.id,
            role_id:employee.role_id,
            permissions
        },
        process.env.JWT_SECRET,
        {expiresIn:'1d'}    
    );

    res.cookie("token", token,{
        httpOnly:true,
        secure:false,
        sameSite:'lax',
        maxAge:24*60*60*1000
    });

    return res.status(200).json({message:'Login successfully.Welcome '+employee.first_name});

    } catch (error) {
        return res.status(500).json({error:error.message});
    }
};

//Logout
const logout=async (req,res) => {
    res.clearCookie('token');
    return res.status(200).json({message:'Logout successfully.'});
};

module.exports={login,logout};