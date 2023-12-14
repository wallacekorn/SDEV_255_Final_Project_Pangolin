// Import necessary modules and packages
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

// Define the Instructor schema
const instructorSchema = new mongoose.Schema({
  // User details
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Minimum password length is 6 characters'],
  },
});

// Hash password before saving to the database
instructorSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Static method to log in an instructor
instructorSchema.statics.login = async function (email, password) {
  const instructor = await this.findOne({ email });
  if (instructor) {
    const auth = await bcrypt.compare(password, instructor.password);
    if (auth) {
      return instructor;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email');
};

// Create and export the Instructor model
const Instructor = mongoose.model('Instructor', instructorSchema);
module.exports = Instructor;