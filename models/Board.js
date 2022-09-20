const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const BoardSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'can\'t be blank'],
    index: true,
    alias: 'board',
  },
  description: {
    type: String,
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
})

autoIncrement.initialize(mongoose.connection)
BoardSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})
BoardSchema.plugin(autoIncrement.plugin, 'Board')
const Board = mongoose.model('Board', BoardSchema)

module.exports = Board
