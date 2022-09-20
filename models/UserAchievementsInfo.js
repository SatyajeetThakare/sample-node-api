const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserAchievementInfoSchema = new mongoose.Schema({
  user: {
    type: Number,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    // ref: 'User'
  },
  certifications: [{
    type: String
  }],
  clubOrgs: [{
    type: String
  }],
  achievements: [{
    type: String
  }],
  awards: [{
    type: String
  }],
  standardizedExam: {
    type: String
  },
  intendedCollegeMajor: [{
    type: String
  }],
  dreamCareer: [{
    type: String
  }],
  dreamUniversities: [{
    type: String
  }],
  countries: [{
    type: String
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

UserAchievementInfoSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UserAchievementInfoSchema.plugin(autoIncrement.plugin, 'UserAchievementInfo')
const UserAchievementInfo = mongoose.model('UserAchievementInfo', UserAchievementInfoSchema)
module.exports = UserAchievementInfo
