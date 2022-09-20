const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
  },
  name: {
    salutation: String,
    firstName: {
      type: String,
      index: true,
      required: [true, 'can\'t be blank'],
    },
    middleName: {
      type: String,
      index: true,
    },
    lastName: {
      type: String,
      index: true,
      required: [true, 'can\'t be blank'],

    },
    suffix: String,
    // required: [true, 'can\'t be blank']
  },
  mobileNumber: {
    type: Number,
  },
  address: {
    type: mongoose.Schema.Types.Mixed,
  },
  gender: {
    type: String,
    index: true,
  },
  affiliatedInstitution: {
    type: Number,
    ref: 'AffiliatedInstitution'
  },
  role: {
    type: Number,
    ref: 'Role',
    default: 1,
    required: [true, 'can\'t be blank'],
  },
  image: {
    type: String,
  },
  remarks: {
    type: String,
  },
  reason: {
    type: String,
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.Mixed,
  },
  updatedBy: {
    type: mongoose.Schema.Types.Mixed,
  },
  calibrationPhase: {
    calibrationPhaseCompleted: { type: Boolean, default: false },
    phases: [{
      name: { type: String },
      link: { type: String, default: null },
      isUserCompleted: { type: Boolean, default: false },
      isUserActivePhase: { type: Boolean, default: false },
      isAdminApproved: { type: Boolean, default: false },
      isAdminActivePhase: { type: Boolean, default: false }
    }],
    attachment: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  paymentDone: {
    type: Boolean,
    default: false
  },
  hash: String,
  salt: String,
}, {
  timestamps: true,
})

autoIncrement.initialize(mongoose.connection)

UserSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UserSchema.plugin(autoIncrement.plugin, 'User')
const User = mongoose.model('User1', UserSchema)
module.exports = User
