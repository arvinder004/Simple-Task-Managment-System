const jwt = require('jsonwebtoken')
require('dotenv').config()

function auth(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ 
                message: "No token" 
            });
        }
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken.id;
        next();
    } catch (err) {
        res.status(403).json({ 
            message: "Invalid credentials" 
        });
    }
}

module.exports = auth