const jwt = require('jsonwebtoken')
const User = require('../models/userModel')


exports.isAuthenticatedUser = async (req, res, next) => {


    const { token }   = req.cookies;
    // const token = req.cookies;
    // console.log(token);

    // console.log(token);
    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Login first to access this resource'
        })
    }
   
    process.env.JWT_SECRET = 'ABCDEFGHIJKLMNOPQR'

    const decodedData = jwt.verify(token, process.env.JWT_SECRET)
    
    req.user= await User.findById(decodedData.id)
    next()
}

// Handling user roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) { //roles is an array
            return next (
                res.status(403).json({
                    success: false,
                    message: `Role (${req.user.role}) is not allowed to access this resource`
                })
            )
        }
        next()
    }
}

// // Handling Seller roles
// exports.authorizeSellerRoles = (...roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) { //roles is an array
//             return next (
//                 res.status(403).json({
//                     success: false,
//                     message: `Role (${req.user.role}) is not allowed to access this resource`
//                 })
//             )
//         }
//         next()
//     }
// }

