const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const AnalystAcademicInfoSchema = new mongoose.Schema({
  user: {
    type: Number,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    ref: 'User'
  },
  orgId: {
    type: Number,
    ref: 'Organization'
  },
  board: {
    type: mongoose.Schema.Types.Mixed
  },
  otherBoardName: {
    type: mongoose.Schema.Types.Mixed
  },
  city: String,
  uniqueCode: String,
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
  hash: String,
  salt: String,
}, {
  timestamps: true,
})

autoIncrement.initialize(mongoose.connection)

AnalystAcademicInfoSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

AnalystAcademicInfoSchema.plugin(autoIncrement.plugin, 'AnalystAcademicInfo')
const AnalystAcademicInfo = mongoose.model('AnalystAcademicInfo', AnalystAcademicInfoSchema)
module.exports = AnalystAcademicInfo
