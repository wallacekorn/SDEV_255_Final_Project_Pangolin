// Importing necessary modules and packages
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Creating a schema for the admin model
const adminSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Please enter email address'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address'], // Validation for a valid email address
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters'], // Validation for a password with at least 6 characters
    },
});

// Before a document is saved to the database, this function runs
adminSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Static method to log in an admin
adminSchema.statics.login = async function(email, password) {
    const admin = await this.findOne({ email });
    if (admin) {
        const auth = await bcrypt.compare(password, admin.password);
        if (auth) {
            return admin;
        }
        throw Error('incorrect password');
    }
    throw Error('incorrect email');
};

// Creating the Admin model using the adminSchema
const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;