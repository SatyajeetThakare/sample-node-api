const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const autoIncrement = require('mongoose-auto-increment')

const UserAcademicInfoSchema = new mongoose.Schema({
  user: {
    type: Number,
    unique: true,
    required: [true, 'can\'t be blank'],
    match: [/\S+@\S+\.\S+/, 'is invalid'],
    index: true
    // ref: 'User'
  },
  gradeDetails: [{
    standard: String,
    school: String,
    standardizedExam: String,
    board: [{
      type: mongoose.Schema.Types.Mixed
    }],
    GPA: String,
    predictedGPA: String,
    subjects: [{
      name: { type: String, required: [true, 'can\'t be blank'] },
      gradedAssignments: [{
        assignmentDate: String,
        task: String,
        assignmentType: String,
        grade: Number,
        maximumGrade: Number,
        isActive: Boolean,
        createdBy: mongoose.Schema.Types.Mixed,
        createdOn: Date,
        updatedBy: mongoose.Schema.Types.Mixed,
        updatedOn: Date
      }],
      syllabus: [{
        chapter: String,
        status: Boolean,
        prescription: String,
        isCompleted: Boolean,
        isActive: Boolean,
        createdBy: mongoose.Schema.Types.Mixed,
        createdOn: Date,
        updatedBy: mongoose.Schema.Types.Mixed,
        updatedOn: Date
      }],
      motivations: [String],
      overallGrade: Number,
      isActive: {
        type: Boolean, default: true
      }
    }],
    exams: {
      SAT: {
        predictedScore: { type: String, default: null },
        nextExamDate: { type: String, default: null },
        previousScores: [{
          paperDate: String,
          paperType: String,
          maths: String,
          english: String,
          total: String
        }],
        notes: { type: String, default: null },
      },
      ACT: {
        predictedScore: { type: String, default: null },
        nextExamDate: { type: String, default: null },
        previousScores: [{
          paperDate: String,
          paperType: String,
          maths: String,
          english: String,
          science: String,
          total: String
        }],
        notes: { type: String, default: null }
      },
      Other: [{
        examName: { type: String, default: null },
        nextExamDate: { type: String, default: null },
        educationAnalystRemark: {
          remark: String,
          remarkOn: { type: String, default: new Date() }
        },
        studentRemark: {
          remark: String,
          remarkOn: { type: String, default: new Date() }
        }
      }]
    },
    motivationMonitor: [{
      year: { type: String, required: [true, 'can\'t be blank'] },
      data: [{
        month: { type: String, required: [true, 'can\'t be blank'] },
        effort: { type: String, required: [true, 'can\'t be blank'] },
        participation: { type: String, required: [true, 'can\'t be blank'] },
        productivity: { type: String, required: [true, 'can\'t be blank'] }
      }]
    }],
    transcriptFile: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  }],
  remarks: {
    type: String,
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
  }
}, {
  timestamps: true,
})

autoIncrement.initialize(mongoose.connection)

UserAcademicInfoSchema.plugin(uniqueValidator, {
  message: 'is already taken.',
})

UserAcademicInfoSchema.plugin(autoIncrement.plugin, 'UserAcademicInfo')
const UserAcademicInfo = mongoose.model('UserAcademicInfo', UserAcademicInfoSchema)
module.exports = UserAcademicInfo
