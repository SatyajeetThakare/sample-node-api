const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const AffiliatedInstitutionSchema = new mongoose.Schema({
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
AffiliatedInstitutionSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})
AffiliatedInstitutionSchema.plugin(autoIncrement.plugin, 'AffiliatedInstitution')
const AffiliatedInstitution = mongoose.model('AffiliatedInstitution', AffiliatedInstitutionSchema)

module.exports = AffiliatedInstitution
