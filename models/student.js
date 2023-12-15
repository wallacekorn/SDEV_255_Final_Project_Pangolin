const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');


const studentSchema = new Schema({
    firstName: {
        type: String,
        required: false,
    },
    lastName: {
        type: String,
        required: false,
    },
    courses: {
        type: Array,
    },
    enrollment: {
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
studentSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// static method to login student
studentSchema.statics.login = async function(email, password) {
    const student = await this.findOne({email});
    if (student) {
        const auth = await bcrypt.compare(password, student.password);
        if (auth) {
            return student;
        }
        throw Error('incorrect password');
      }
      throw Error('incorrect email');
    };

const Student = mongoose.model('Student', studentSchema);
module.exports = Student;