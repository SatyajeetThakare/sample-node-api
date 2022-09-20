const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'can\'t be blank'],
    index: true,
  },
  averageGPA: {
    type: String,
  },
  averageSAT: {
    type: String,
  },
  averageACT: {
    type: String,
  },
  USPs: [{
    type: String
  }],
  location: {
    type: String,
    default: ''
  },
  ranking: {
    type: Number
  },
  tuition: {
    fee: {
      type: String
    },
    UOM: {
      type: String
    }
  },
  classSize: {
    type: Number
  },
  studentToFacultyRatio: {
    type: String
  },
  totalSize: {
    type: String
  },
  percentageOfIntStudents: {
    type: String
  },
  topMajors: [{
    type: String
  }],
  applicationDeadlines: [{
    round: { type: Number },
    roundName: { type: String, default: null },
    roundDate: { type: Date }
  }],
  applicationRequirements: [{
    type: String
  }],
  website: {
    type: String
  },
  comparativeAnalysis: [{
    category: { type: String, default: null },
    studentPercentage: { type: Number, default: 0 },
    universityRequirement: { type: Number, default: 0 },
  }],
  admissionEmail: {
    type: String, default: null
  },
  educationAnalystRemark: {
    type: String, default: null
  },
  studentRemark: {
    type: String, default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.Mixed,
  },
  updatedBy: {
    type: mongoose.Schema.Types.Mixed,
  },
  remarks: {
    type: String,
  },
  reason: {
    type: String,
  }
}, {
  timestamps: true,
})

autoIncrement.initialize(mongoose.connection)

UniversitySchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UniversitySchema.plugin(autoIncrement.plugin, 'University')
const University = mongoose.model('University', UniversitySchema)
module.exports = University
