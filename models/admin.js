const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const adminSchema = new Schema({
    isAdmin: {
        type: Boolean,
        required: true,
        default: true
    },
    isTeacher: {
        type: Boolean,
        required: true,
        default: true
    },
    email: {
        type: String,
        required: [true, 'Please enter email address'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Password must be at least 6 characters']
    },
});
// Before document is saved to db, this runs
adminSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login admin
adminSchema.statics.login = async function(email, password) {
    const admin = await this.findOne({email});
    if (admin) {
        const auth = await bcrypt.compare(password, admin.password);
        if (auth) {
            return admin;
        }
        throw Error('incorrect password');
      }
      throw Error('incorrect email');
    };

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;