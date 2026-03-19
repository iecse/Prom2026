const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Don't return password by default
    },

    // Educational Information
    college: {
      type: String,
      required: [true, 'College name is required'],
      trim: true,
    },
    branch: {
      type: String,
      required: [true, 'Branch is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Year of study is required'],
      enum: ['1st', '2nd', '3rd', '4th'],
    },

    // Payment Information
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    transactionId: {
      type: String,
      trim: true,
    },
    paymentAmount: {
      type: Number,
      default: 0,
    },
    paymentDate: {
      type: Date,
    },

    // Event Registration
    registeredEvents: [
      {
        eventName: {
          type: String,
          enum: ['Enigma', 'Order of Chaos', 'Tech Quiz'],
        },
        registrationDate: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ['registered', 'participated', 'completed'],
          default: 'registered',
        },
      },
    ],

    // Account Status
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      select: false,
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  // Only hash if password is new or modified
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to register for an event
userSchema.methods.registerForEvent = function (eventName) {
  // Check if already registered
  const alreadyRegistered = this.registeredEvents.some(
    (event) => event.eventName === eventName
  );

  if (alreadyRegistered) {
    throw new Error(`Already registered for ${eventName}`);
  }

  this.registeredEvents.push({
    eventName,
    registrationDate: new Date(),
    status: 'registered',
  });
};

// Method to get all registered events
userSchema.methods.getRegisteredEvents = function () {
  return this.registeredEvents.map((event) => event.eventName);
};

module.exports = mongoose.model('User', userSchema);
