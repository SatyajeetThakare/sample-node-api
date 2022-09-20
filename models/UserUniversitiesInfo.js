const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserUniversitiesInfoSchema = new mongoose.Schema({
  user: {
    type: Number,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    ref: 'User'
  },
  universities: [{
    category: { type: String },
    universityList: [{
      type: mongoose.Schema.Types.Mixed,
      ref: 'University'
    }]
  }],
  remarks: {
    type: String,
  },
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

UserUniversitiesInfoSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UserUniversitiesInfoSchema.plugin(autoIncrement.plugin, 'UserUniversitiesInfo')
const UserUniversitiesInfo = mongoose.model('UserUniversitiesInfo', UserUniversitiesInfoSchema)
module.exports = UserUniversitiesInfo
