const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const SubjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'can\'t be blank'],
    index: true,
    alias: 'role',
  },
  description: {
    type: String,
    default: null
  },
  board: {
    type: Number,
    default: null
  },
  remarks: {
    type: String,
    default: null
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
  }
}, {
  timestamps: true,
}, {
  indexes: [
      {
          unique: true,
          fields: ['name', 'board']
      }
  ]
})

autoIncrement.initialize(mongoose.connection)
SubjectSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})
SubjectSchema.plugin(autoIncrement.plugin, 'Subject')
const Subject = mongoose.model('Subject', SubjectSchema)

module.exports = Subject
