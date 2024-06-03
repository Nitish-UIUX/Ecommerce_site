const moongose = require('mongoose')
const validator = require('validator')
const bcryptjs = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')


const userSchema = new moongose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name'],
        maxLength: [30, 'Your name cannot exceed 30 characters']
    },
    email:{
        type: String,
        required: [true, 'Please enter a valid email'],
        unique: true,
        validate: [validator.isEmail, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Your password must be longer than 6 characters'],
        select: false
    },
    avatar:{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        }
    },
    role:{
            type: String,
            default: "user"
    },
    createdAt:{
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
});

// Encrypting password before saving user in sha1 format
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
})

//     // Change the password to its SHA-1 format
//     const sha1Password = crypto.createHash('sha1').update(this.password).digest('hex');
//     this.password = sha1Password;

//     next();
// });





// userSchema.pre('save', async function(next){
//     if(!this.isModified('password')){
//         next()
//     }
//     this.password = await bcryptjs.hash(this.password, 10)
// })

// JWT token

// require('dotenv').config({ path: 'backend/config/config.env' });


userSchema.methods.getJwtToken = function(){
    process.env.JWT_SECRET = 'ABCDEFGHIJKLMNOPQR'
    process.env.JWT_EXPIRES_TIME = '5d'

    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_TIME
    })

    //process.env.JWT_SECRET-> this is the secret key
    //process.env.JWT_EXPIRES_TIME-> this is the time for the token to expire
}

// Compare user password
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcryptjs.compare(enteredPassword, this.password)
}

// Generate password reset token
userSchema.methods.getResetPasswordToken = function(){
    // Generate token
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex')

    //Hashing and Generation resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(this.resetPasswordToken)
        .digest('hex')

    // Set expire time
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return this.resetPasswordToken;
}

module.exports = moongose.model('User', userSchema)