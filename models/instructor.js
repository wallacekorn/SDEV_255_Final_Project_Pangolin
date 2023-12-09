const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const instructorSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    courses: {
        type: Array,
        required: false
    },
    isTeacher: {
        type: Boolean,
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
instructorSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login admin
instructorSchema.statics.login = async function(email, password) {
    const instructor = await this.findOne({email});
    if (instructor) {
        const auth = await bcrypt.compare(password, instructor.password);
        if (auth) {
            return instructor;
        }
        throw Error('incorrect password');
      }
      throw Error('incorrect email');
    };

const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;