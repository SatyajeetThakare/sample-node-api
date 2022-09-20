const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserPlannerInfoSchema = new mongoose.Schema({
  user: {
    type: Number,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    // ref: 'User'
  },
  timeline: [{
    title: { type: String, default: null },
    category: { type: String, default: null },
    description: { type: String, default: null },
    colorCode: String,
    from: Date,
    to: Date,
    createdBy: Number,
    createdOn: Date,
    updatedBy: Number,
    updatedOn: Date,
    isActive: { type: Boolean, default: true }
  }],
  educationAnalystRemark: { type: String, default: null },
  studentRemark: { type: String, default: null },
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

UserPlannerInfoSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UserPlannerInfoSchema.plugin(autoIncrement.plugin, 'UserPlannerInfo')
const UserPlannerInfo = mongoose.model('UserPlannerInfo', UserPlannerInfoSchema)
module.exports = UserPlannerInfo