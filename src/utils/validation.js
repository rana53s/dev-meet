const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId } = req.body;

    if (!firstName || !lastName) {
        throw new Error("Please enter your first name and last name");
    } else if (firstName.length < 2 || firstName.length > 50) {
        throw new Error("The first name should be between 2 and 50 characters in length.");
    } else if (lastName.length < 2 || lastName.length > 50) {
        throw new Error("The Last name should be between 2 and 50 characters in length.");
    }

    if (!validator.isEmail(emailId)) {
        throw new Error("Invalid email address: " + emailId);
    }
}

const validateIfPasswordIsStrong = (password) => {

    if(!validator.isStrongPassword(password)) {
        throw new Error("Password is weak, please enter a strong one: " + password)
    }
    return true;
}

const validateEditProfileData = (req) => {
    const allowedField = ["firstName", "lastName", "age", "gender", "imageUrl"];

    // Add proper validations for all the fields using the validator

    /* Make one global validation function that accepts all the fields optionally and validate
     here, only pass those fields that's are needed
    */
    const isUpdateAllowed = Object.keys(req.body).every((item) => allowedField.includes(item));
    return isUpdateAllowed;
}

module.exports = {
    validateSignUpData,
    validateEditProfileData,
    validateIfPasswordIsStrong
}
