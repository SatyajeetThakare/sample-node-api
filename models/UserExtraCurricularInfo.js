const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserExtraCurricularInfoSchema = new mongoose.Schema({
  user: {
    type: Number,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true,
    // ref: 'User'
  },
  academic: [{
    name: String,
    progress: Number,
    isActive: { type: Boolean, default: true }
  }],
  leadership: [{
    name: String,
    progress: Number,
    isActive: { type: Boolean, default: true }
  }],
  cas: [{
    name: String,
    progress: Number,
    isActive: { type: Boolean, default: true }
  }],
  personalDevelopment: [{
    name: String,
    progress: Number,
    isActive: { type: Boolean, default: true }
  }],
  attachments: {
    resume: {
      url: { type: String, default: null },
      fileName: { type: String, default: null },
      uploadedOn: { type: String, default: new Date() }
    },
    coverLetter: {
      url: { type: String, default: null },
      fileName: { type: String, default: null },
      uploadedOn: { type: String, default: new Date() }
    },
    mentorNetwork: {
      url: { type: String, default: null },
      fileName: { type: String, default: null },
      uploadedOn: { type: String, default: new Date() }
    }
  },
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

UserExtraCurricularInfoSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UserExtraCurricularInfoSchema.plugin(autoIncrement.plugin, 'UserExtraCurricularInfo')
const UserExtraCurricularInfo = mongoose.model('UserExtraCurricularInfo', UserExtraCurricularInfoSchema)
module.exports = UserExtraCurricularInfo
