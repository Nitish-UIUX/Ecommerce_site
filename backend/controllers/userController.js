const User = require('../models/userModel')
// const ErrorHandler = require('../middleware/error');
const sendToken = require('../utils/jwToken');
const sendEmail = require('../utils/sendEmail');
// const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const cloudinary = require('cloudinary');


// -------------------------- registerUser---------------------------------
exports.registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            // User with this email already exists
            return res.status(400).json({ error: 'User with this email already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: 'this is a sample id',
                url: 'profilepic.jpg'
            }
        });

        // Change the password to its SHA-1 hash
        const sha1Password = crypto.createHash('sha1').update(password).digest('hex');
        user.password = sha1Password;

        // Save the user into the database
        await user.save();

        // Console log the hashed password
        console.log("SHA-1 Hashed Password:", sha1Password);

        // Send the token and response
        sendToken(user, 201, res);
    } catch (error) {
        console.error(error);
        // Handle the error and send an appropriate response
        return res.status(500).json({ error: 'Registration failed' });
    }
};


// ---------------------------------------Login User----------------------------------------
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;

    // convert the password to its SHA-1 hash
    const sha1Password = crypto.createHash('sha1').update(password).digest('hex');
    console.log("SHA-1 Hashed Password:", sha1Password);

    // find the email and sha1 password in the database exists or not   
    const user = await User.findOne({ email, password: sha1Password });
    console.log("user: ", user);

    // if user is not found in the database then give error message
    if (!user) {
        res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        })
    }

    sendToken(user, 200, res);
}

// //function for login user => /api/v1/login
// exports.loginUser = async (req, res, next) => {
//     const { email, password } = req.body;   
//     console.log("email: ", email);
//     console.log("password: ", password);

//     // Change the password to its SHA-1 hash
//     const sha1Password = crypto.createHash('sha1').update(password).digest('hex');

//     console.log("SHA-1 Hashed Password:", sha1Password);

//     // find the email and sha1 password in the database exists or not
//     const user = await User.findOne({ email, password: sha1Password });
//     console.log("user: ", user);

//     // if user is not found in the database then give error message
//     if(!user){
//         res.status(401).json({
//             success: false,
//             message: "Invalid Email or Password"
//         })
//     }

//     res.status(200).json({
//         success: true,
//         message: user
//     });
//     // if user is found in the database then send the token and login the user
//     sendToken(user, 201, res);
// };


//------------------------- logout user => /api/v1/logout--------------------------------

exports.logoutUser = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out Successfully"
    })
}

//--------------------- forgot password => /api/v1/password/forgot---------------------
exports.forgotPassword = async (req, res, next) => {
    // fetch email from req.body
    const email = req.body.email;
    console.log("email: ", email);

    const user = await User.findOne({ email });

    // check the email in the database exists or not
    if (!user) {
        res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    // if email is exist in the database then give option to change the password(new password and confirm password)
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;

    // check if the new password and confirm password is same or not
    if (newPassword !== confirmNewPassword) {
        res.status(401).json({
            success: false,
            message: "New Password and Confirm Password do not match"
        })
    }
    // change the newpassword to its SHA-1 hash
    const sha1Password = crypto.createHash('sha1').update(newPassword).digest('hex');

    // if the new password and confirm password is same then update the password in the database before update the update the password change it into hash
    user.password = sha1Password;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    })
}


//-------------------- reset password => /api/v1/password/reset/:token-------------------
exports.resetPassword = async (req, res, next) => {
    // fetch email and password from req.body
    const email = req.body.email;
    const oldpassword = req.body.oldpassword;

    // console.log("email: ", email);
    // console.log("password: ", oldpassword);

    // change the password in sha1 format
    const sha1Password = crypto.createHash('sha1').update(oldpassword).digest('hex');
    console.log("SHA-1 Hashed Password:", sha1Password);

    // find the email and hash password in the database exists or not
    const user = await User.findOne({ email, password: sha1Password });
    console.log("user: ", user);

    // if email or password anyof the one is not found in the database then give error message
    if (!user) {
        res.status(401).json({
            success: false,
            message: "Invalid Email or Password"
        })
    }

    // if user is found the give opion to change the password
    const newPassword = req.body.newPassword;
    const confirmNewPassword = req.body.confirmNewPassword;

    // check if the new password and confirm password is same or not
    if (newPassword !== confirmNewPassword) {
        res.status(401).json({
            success: false,
            message: "New Password and Confirm Password do not match"
        })
    }

    // if the new password and confirm password is same then update the password in the database in sha1 format
    const sha1UpdatedPassword = crypto.createHash('sha1').update(newPassword).digest('hex');
    user.password = sha1UpdatedPassword;
    await user.save();

    res.status(200).json({
        success: true,
        message: "Password updated successfully"
    });
}








// --------------------get currently logged in user details => /api/v1/me-----------------
exports.getUserProfile = async (req, res, next) => {

    const user = await User.findById(req.user.id);

    // console.log("user: ", user);

    sendToken(user, 200, res)
}

// // function for update / change password => /api/v1/password/update
// exports.updatePassword = async (req, res, next) => {

//     // const user = await User.findById(req.user.id).select('+password');
//     //access the user password from req.body and compare it with the user password in the database
//     //define user
//     const user = await User.findById(req.user.id).select('+password');


//     if(!isPasswordMatched){
//         res.status(401).json({
//             success: false,
//             message: "Old password is incorrect"
//         })
//         // return next(new ErrorHandler('Old password is incorrect', 400))
//     }

//     if(req.body.newPassword !== req.body.confirmPassword){
//         res.status(401).json({
//             success: false,
//             message: "Password doesn't match"
//         })
//         // return next(new ErrorHandler('Password doesn\'t match', 400))
//     }

//     user.password = req.body.newPassword;
//     await user.save();

//     // res.status(200).json({
//     //     success: true,
//     //     message: "Password updated successfully"
//     // })

//     sendToken(user, 200, res)
// }







// -------------------------------update user profile => /api/v1/me/update-------------------------
exports.updateProfile = async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email
    }
    



    const user = await User.findByIdAndUpdate(req.user.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    });
}

// --------------------------- get all users => (Admin)------------------------------
exports.getallUsers = async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })
}

// -----------------------------------------get Single user details =>(Admin)----------------
exports.getSingleUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    res.status(200).json({
        success: true,
        user
    })
}

// -----------------------------update user Role => (Admin) /api/v1/admin/user/:id---------------------
exports.updateUserRole = async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    // we will add cloudinary later
    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true
    });
}

// -------------------------delete user => (Admin) /api/v1/admin/user/:id--------------------------
exports.deleteUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);

    // we will remove cloudinary later

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found"
        })
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
}