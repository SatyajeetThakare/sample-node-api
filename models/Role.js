const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'can\'t be blank'],
    index: true,
    alias: 'role',
  },
  description: {
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
  }
}, {
  timestamps: true,
})

autoIncrement.initialize(mongoose.connection)
RoleSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})
RoleSchema.plugin(autoIncrement.plugin, 'Role')
const Role = mongoose.model('Role', RoleSchema)

module.exports = Role
