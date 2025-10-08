const jwt = require('jsonwebtoken')
function auth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ 
                message: "No token provided or token is not a Bearer token" 
            });
        }

        const token = authHeader.split(' ')[1];
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

module.exports = auth;