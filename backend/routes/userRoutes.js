const express = require('express');
const { registerUser, loginUser, forgotPassword, resetPassword, logoutUser, getUserProfile, updatePassword, updateProfile, getSingleUser, getallUsers, updateUserRole, deleteUser } = require('../controllers/userController');
const { isAuthenticatedUser, authorizeRoles } = require('../middleWare/auth');

//API to register user
const router = express.Router();

// router.post("/register", registerUser);
router.route("/register").post(registerUser);

//API to login user
router.post("/login", loginUser);

//API for forgot password
router.post("/password/forgot", forgotPassword);

// API for reset password
router.put("/password/reset", isAuthenticatedUser, resetPassword);

//API to logout user
router.get("/logout", logoutUser);

// API for userDeatils
router.get("/me", isAuthenticatedUser, getUserProfile);

// // API to update password
// router.put("/password/update", isAuthenticatedUser, updatePassword);

// API to update user profile=> /api/v1/me/update
router.put("/me/update", isAuthenticatedUser, updateProfile);

// API to get all users => /api/v1/admin/users
router.get("/admin/users", isAuthenticatedUser, authorizeRoles("admin"), getallUsers);

// API to get Single user details => /api/v1/admin/user/:id
router.get("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), getSingleUser);

// API to update user Role => /api/v1/admin/user/:id
router.put("/admin/user/:id", isAuthenticatedUser, updateUserRole);

// API to delete user => /api/v1/admin/user/:id
router.delete("/admin/user/:id", isAuthenticatedUser, authorizeRoles("admin"), deleteUser);


module.exports = router;