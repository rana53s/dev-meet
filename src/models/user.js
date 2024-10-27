const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
    firstName: { 
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
    },
    lastName: { 
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true
    },
    emailId: { 
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Invalid email address: " + value)
            }
        }
    },
    password: { 
        type: String,
        required: false,
        minLength: [8, 'Password must be length of at least 8, got {VALUE}'],
        trim: true,
        validate(value) {
            if(!validator.isStrongPassword(value)) {
                throw new Error("Password is weak, please enter a strong one: " + value)
            }
        }
    },
    age: { 
        type: Number,
        min: [16, 'Must be at least 16, got {VALUE}'],
        max: [80, 'Age must be 80 or below, got {VALUE}']
    },
    gender: { 
        type: String,
        enum: ['male', 'female', 'other'],
        required: true,
        validate(value) {
            if(!['male', 'female', 'other'].includes(value)) {
                throw new Error('Gender is not valid')
            }
        }
    },
    imageUrl: {
        type: String,
        default: '',
        trim: true,
        validate(value) {
            if(!validator.isURL(value)) {
                throw new Error("Invalid image url address: " + value)
            }
        }
    },
    skills: {
        type: [String]
    }
},
{
    timestamps: true
})

userSchema.index({ firstName: 1, lastName: 1})

userSchema.methods.getJWT = async function () {
    const user = this;
    const token = await jwt.sign({ _id: user._id }, `${process.env.SECRET_ACCESS_TOKEN}`, { expiresIn: "1d" });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInput) {
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInput, user.password);
    return isPasswordValid;
}

// Create the model
const User = mongoose.model("User", userSchema)
module.exports = User;
