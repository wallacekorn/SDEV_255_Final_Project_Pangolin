// Import necessary modules and packages
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Define the Student schema
const studentSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please enter your first name'],
    },
    lastName: {
        type: String,
        required: [true, 'Please enter your last name'],
    },
    courses: {
        type: Array
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
        minlength: [6, 'Minimum password length is 6 characters'],
    },
});

// Hash password before saving to the database
studentSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to log in a student
studentSchema.statics.login = async function (email, password) {
  const student = await this.findOne({ email });
  if (student) {
    const auth = await bcrypt.compare(password, student.password);
    if (auth) {
      return student;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

// Create and export the Student model
const Student = mongoose.model('Student', studentSchema);
module.exports = Student;