const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserEventInfoSchema = new mongoose.Schema({
  user: {
    type: Number,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    // ref: 'User'
  },
  eventDetails: [{
    title: { type: String, required: true },
    colorCode: { type: String, required: true },
    eventDate: { type: String, required: true },
    category: { type: String, required: true },
    notes: { type: String },
    meetingLink: { type: String },
    remarks: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: Number,
    ref: 'User'
  },
  updatedBy: {
    type: Number,
    ref: 'User'
  }
}, {
  timestamps: true,
})

autoIncrement.initialize(mongoose.connection)

UserEventInfoSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UserEventInfoSchema.plugin(autoIncrement.plugin, 'UserEventInfo')
const UserEventInfo = mongoose.model('UserEventInfo', UserEventInfoSchema)
module.exports = UserEventInfo