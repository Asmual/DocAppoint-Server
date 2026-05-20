const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
   
    const sessionToken = req.cookies?.["better-auth.session_token"];

    if (sessionToken) {
        
        return next();
    }

    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).send({ 
                    success: false, 
                    message: 'Forbidden access: Invalid or expired token' 
                });
            }
            req.decoded = decoded;
            return next();
        });
    } else {
        return res.status(401).send({ 
            success: false, 
            message: 'Unauthorized access: Login required' 
        });
    }
};

module.exports = verifyJWT;