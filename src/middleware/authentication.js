const jwt= require('jsonwebtoken');

const authentication=async (req,res,next) => {
    try {
    const token=req.cookies.token;

    if(!token){
        return res.status(401).json({error:'Access denied. No token provided.'});
    }
    
        const decoded=jwt.verify(
            token,
            process.env.JWT_SECRET
        );

            req.employee=decoded;
            next();
    } catch (error) {
        return res.status(401).json({error:"Invalid token."});
    }
};

module.exports={authentication};