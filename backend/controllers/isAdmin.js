const User = require("../models/User");

function isAdmin(req, res, next){
    if(req.user){
        User.findById(req.user).then(user =>{
            if(user && user.role === 'admin'){
                next()
            } else {
                res.status(403).json({
                    message: "Forbidden: Admins only"
                })
            }
        }).catch(() => {
            res.status(500).json({
                message: "Server Error"
            })
        }) 
    } else {
        res.status(401).json({
            message: 'Unauthorized'
        })
    }
}

module.exports = isAdmin