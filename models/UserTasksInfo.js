const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserTaskInfoSchema = new mongoose.Schema({
  user: {
    type: Number,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    // ref: 'User'
  },
  taskDetails: [{
    category: { type: String },
    taskList: [{
      subCategory: { type: String, default: null },
      tasks: [{
        task: String,
        isActive: Boolean,
        isCompleted: Boolean,
        createdBy: Number,
        createdOn: Date,
        updatedBy: Number,
        updatedOn: Date
      }]
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

UserTaskInfoSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UserTaskInfoSchema.plugin(autoIncrement.plugin, 'UserTaskInfo')
const UserTaskInfo = mongoose.model('UserTaskInfo', UserTaskInfoSchema)
module.exports = UserTaskInfo