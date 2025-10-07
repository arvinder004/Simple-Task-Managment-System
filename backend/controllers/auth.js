const jwt = require('jsonwebtoken')
require('dotenv').config()

function auth (req, res, next) {
    const token = req.headers.authorization;
    
    if(!token){
        return res.status(401).json({
            message: "No token"
        })
    }

    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken.id
        next()
    } catch (err){
        console.log(err)
        res.status(403).json({
            message: "invalid credentials"
        })
    }
}

module.exports = auth