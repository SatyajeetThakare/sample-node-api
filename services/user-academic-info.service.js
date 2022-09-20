const UserAcademicInfo = require('../models/UserAcademicInfo')
const UserUniversityInfoService = require('./user-university-info.service');
const FileUploadService = require('./file-upload.service');
const path = require(`path`);

function createUserAcademicInfo(user) {

  // Subjects come as string from front end, convert into object with other properties
  if (user.student.academics) {
    let subjectsAsAnObjectsArray = [];
    user.student.academics[0].subjects.forEach(element => {
      // subjectsAsAnObjectsArray.push({ name: element });
      subjectsAsAnObjectsArray.push(element);
    });
    user.student.academics[0].subjects = subjectsAsAnObjectsArray;
  }

  // Set standardizedExam in academic collection as well
  user.student.academics[0].standardizedExam = user.student.standardizedExam;
  let academicInfo = {
    gradeDetails: user.student.academics,
    user: user._id
  };

  return new Promise((resolve, reject) => {
    try {
      UserAcademicInfo.create(academicInfo, function (error, doc) {
        if (error) {
          reject(error);
        } else {
          UserUniversityInfoService.createUserUniversityInfo(user).then((userUniversityDoc) => {
            resolve(userUniversityDoc);
          }).catch(error => {
            reject(error);
          });
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateUserAcademicInfo(req) {
  return new Promise((resolve, reject) => {
    try {

      const query = { _id: req.body._id };
      const update = { $set: { "gradeDetails.$[]": req.body.gradeDetails[0] } };
      const options = { upsert: true, many: true };

      UserAcademicInfo.updateOne(query, update, options).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateUserAcademicInfoMotivationMonitor(req) {
  return new Promise(async (resolve, reject) => {
    try {

      let yearRecordPresent = await findMotivationMonitorByYear(req);
      // console.log('yearRecordPresent', yearRecordPresent);

      if (!yearRecordPresent) {
        let yearRecordSaved = await saveMotivationMonitorByYear(req);
        resolve(yearRecordSaved);
      } else {
        let monthRecordPresent = await findMotivationMonitorByMonth(req);
        // console.log('monthRecordPresent', monthRecordPresent);
        let yearIndexValue = 0;
        let monthIndexValue = 0;
        if (monthRecordPresent) {
          let motivationMonitorArray = monthRecordPresent.gradeDetails[0].motivationMonitor;
          yearIndexValue = motivationMonitorArray.findIndex(e => e.year == req.body.motivationMonitor.year);
          monthIndexValue = motivationMonitorArray[yearIndexValue].data.findIndex(e => e.month == req.body.motivationMonitor.data.month);
        }
        console.log('yearIndexValue', yearIndexValue, monthIndexValue);
        let monthRecordAdded = await saveMotivationMonitorByMonth(req, monthRecordPresent ? 'update' : 'add', yearIndexValue, monthIndexValue);
        resolve(monthRecordAdded);
      }
    } catch (error) {
      throw error;
      reject(error);
    }
  });
}

function findMotivationMonitorByYear(req) {
  return new Promise((resolve, reject) => {
    try {

      const yearName = req.body.motivationMonitor.year;
      const query = { _id: req.body._id, gradeDetails: { $elemMatch: { motivationMonitor: { $elemMatch: { year: yearName } } } } };

      UserAcademicInfo.findOne(query).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function findMotivationMonitorByMonth(req) {
  return new Promise((resolve, reject) => {
    try {
      const yearName = req.body.motivationMonitor.year;
      const monthName = req.body.motivationMonitor.data.month;
      // console.log('monthName', monthName);
      var query = { _id: req.body._id, gradeDetails: { $elemMatch: { motivationMonitor: { $elemMatch: { data: { $elemMatch: { month: monthName } } } } } } };

      UserAcademicInfo.findOne(query).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function saveMotivationMonitorByYear(req) {
  return new Promise((resolve, reject) => {
    try {
      var query = { _id: req.body._id };
      var update = {
        $push: {
          "gradeDetails.0.motivationMonitor": req.body.motivationMonitor
        }
      }

      UserAcademicInfo.findOneAndUpdate(query, update).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function saveMotivationMonitorByMonth(req, operation = 'add', yearIndexValue, monthIndexValue = 0) {
  return new Promise((resolve, reject) => {
    try {
      // console.log('operation', operation);
      const yearName = req.body.motivationMonitor.year;
      const monthName = req.body.motivationMonitor.data.month;
      // console.log('monthName', monthName, yearIndexValue, monthIndexValue);
      var query = null;
      var update;
      if (operation.toLowerCase() == 'add') {
        // update = { $push: { [`gradeDetails.0.motivationMonitor.${yearName}`.data]: req.body.motivationMonitor.data } };
        query = { _id: req.body._id };
        update = {
          $push: {
            "gradeDetails.0.motivationMonitor.$[elem].data": req.body.motivationMonitor.data
          }
        }
        console.log('push', update);

        var filters = {
          arrayFilters: [
            { "elem.year": yearName }
          ]
        }
      } else if (operation.toLowerCase() == 'update') {
        query = { _id: req.body._id, gradeDetails: { $elemMatch: { motivationMonitor: { $elemMatch: { data: { $elemMatch: { month: monthName } } } } } } }
        update = { $set: { [`gradeDetails.0.motivationMonitor.${yearIndexValue}.data.${monthIndexValue}`]: req.body.motivationMonitor.data } };
      }
      console.log('monthName', query, update);

      UserAcademicInfo.findOneAndUpdate(query, update, filters).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      console.log('error 160', error);
      reject(error);
    }
  });
}

function updateUserAcademicInfoExam(req) {
  return new Promise((resolve, reject) => {
    try {

      const examType = req.body.examType;
      const query = { _id: req.body._id };
      let update;
      if (examType === 'Other') {
        update = { $push: { [`gradeDetails.0.exams.${examType}`]: req.body.exams } };
      } else {
        update = { $set: { [`gradeDetails.0.exams.${examType}`]: req.body.exams } };
        if (req.body.exams.standardizedExam) {
          update = {
            $set: {
              [`gradeDetails.0.exams.${examType}`]: req.body.exams,
              [`gradeDetails.0.standardizedExam`]: examType
            }
          };
        }
        console.log('update', update);
      }
      const options = { upsert: true };
      UserAcademicInfo.updateOne(query, update, options).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateUserAcademicInfoExamStudentRemark(req) {
  return new Promise((resolve, reject) => {
    try {
      const examType = req.body.examType;
      const examId = req.body.exams._id;

      if (examType === 'Other') {
        const query = {
          _id: req.body._id,
          [`gradeDetails.0.exams.Other`]: { $elemMatch: { _id: examId } }
        };

        req.body.exams.studentRemark.remarkOn = new Date();
        const update = {
          $set: { [`gradeDetails.0.exams.Other.$`]: req.body.exams }
        };
  
        UserAcademicInfo.findOneAndUpdate(query, update).exec(function (error, doc) {
          if (error) {
            reject(error);
          } else {
            console.log('doc', doc);
            resolve(doc);
          }
        });
      } else {
        reject('Wrong exam type');
      }
    } catch (error) {
      reject(error);
    }
  });
}

function createUserAcademicInfoSubject(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const subjectExists = await checkIfSubjectAlreadyExists(req);

      if (subjectExists) {
        reject('Subject already exists');
      } else {
        const query = {
          _id: req.body._id
        };
        const update = { $push: { "gradeDetails.0.subjects": req.body.subjects } };
        const options = { upsert: true };
        UserAcademicInfo.updateOne(query, update, options).exec(function (error, doc) {
          if (error) {
            reject(error);
          } else {
            resolve(doc);
          }
        });
      }
    } catch (error) {
      console.log('error 255', error);
      reject(error);
    }
  });
}

function checkIfSubjectAlreadyExists(req) {
  return new Promise((resolve, reject) => {
    try {
      const subjectName = req.body.subjects.name;
      const query = {
        _id: req.body._id,
        "gradeDetails.subjects.name": subjectName
      };

      UserAcademicInfo.findOne(query).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateUserAcademicInfoSubject(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const subjectId = req.body.subjects._id;
      delete req.body.subjects._id;
      const query = {
        _id: req.body._id,
        [`gradeDetails.0.subjects`]: { $elemMatch: { _id: subjectId } }
      };
      const update = { $set: { [`gradeDetails.0.subjects.$`]: req.body.subjects } };

      UserAcademicInfo.updateOne(
        query,
        update, (error, doc) => {
          if (error) {
            reject(error);
          } else {
            resolve(doc);
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}

function getUserAcademicInfoByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      var query = { user: id }
      UserAcademicInfo.findOne(query).exec(async function (error, doc) {
        if (error) {
          reject(error);
        } else {
          if (!doc) {
            resolve(doc);
          } else {
            processAcademicInfo(doc).then((result) => {
              resolve(result);
            }).catch((error) => {
              reject(error)
            });
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function processAcademicInfo(doc) {
  return new Promise((resolve, reject) => {
    try {
      let academicInfoDoc = JSON.parse(JSON.stringify(doc));
      academicInfoDoc.gradeDetails[0].subjects = academicInfoDoc.gradeDetails[0].subjects.filter(e => e.isActive);
      // console.log('academicInfoDoc', academicInfoDoc.gradeDetails[0].subjects);
      academicInfoDoc.gradeDetails[0].subjects.forEach((e, i) => {
        ['Classwork', 'Homework', 'Test'].forEach(async (assignmentType, innerIndex) => {
          let typeArray = e.gradedAssignments.filter(e => e.assignmentType == assignmentType);
          // console.log('typeArray', typeArray);
          let data = (await sum(typeArray, 'grade') / await sum(typeArray, 'maximumGrade')) * 100;
          // console.log('data', assignmentType, data);
          e[assignmentType.toLowerCase()] = Math.round(data || 0);

          let syllabusCompleted = e.syllabus.filter(e => e.status);
          e.syllabusCompletion = Math.round((syllabusCompleted.length / e.syllabus.length) * 100);
        })
      });

      resolve(academicInfoDoc);
    } catch (error) {
      reject(error);
    }
  });
}

function getAcademicChartData(req) {
  return new Promise(async (resolve, reject) => {
    try {
      let id = req.params.id;
      let type = req.body.examType;
      let averageScores = [];
      let userUniversityInfo = await UserUniversityInfoService.getUserUniversityInfo(id);
      // console.log('userUniversityInfo', userUniversityInfo);
      if (userUniversityInfo) {
        userUniversityInfo.universities.forEach(element => {
          let top4Universities = [...element.universityList].slice(0, 4);
          let top4Scores = top4Universities.map(x => ({ score: x[`average${type}`], name: x.name }));
          // console.log('top4Scores', top4Scores, type);
          averageScores = averageScores.concat(top4Scores);
        });
      }
      resolve(averageScores);
    } catch (error) {
      console.log('error', error);
      return reject(error);
    }
  });
}

function sum(typeArray, key) {
  return new Promise((resolve, reject) => {
    try {
      if (typeArray.length > 0) {
        let totalAmount = 0;
        typeArray.forEach(data => totalAmount = totalAmount + (data[key] ? data[key] : 0));
        resolve(totalAmount || 0);
      } else {
        resolve(0);
      }
    } catch (error) {
      console.log('error', error);
      reject(error);
    }
  });
}

function getUserAcademicSubjectInfoById(req) {
  return new Promise((resolve, reject) => {
    try {

      const query = {
        _id: req.body._id
      };
      const subjectId = req.body.subjectId;

      UserAcademicInfo.findOne(query).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          let matchingDoc = {};
          if (doc && doc.gradeDetails) {
            matchingDoc = doc.gradeDetails[0].subjects.find(e => e._id == subjectId);
            console.log(matchingDoc);
          }
          console.log(doc, matchingDoc);
          resolve(matchingDoc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function updateUserAcademicInfoTranscriptAttachment(req) {
  return new Promise((resolve, reject) => {
    try {
      // console.log('req.body', req.body);
      const fileType = 'transcript';
      FileUploadService.uploadFile(req, fileType, 'academic-uploads').then(async (filePath) => {

        let docObj = {
          url: filePath,
          fileName: req.file.originalname,
          uploadedOn: new Date()
        }
        const query = { _id: req.body._id };
        const update = {
          $set: { ['gradeDetails.0.transcriptFile']: docObj }
        }
        // Update the collection
        UserAcademicInfo.update(query, update, function (error, doc) {
          if (error) {
            reject(error);
          } else {
            resolve(doc);
          }
        });
      }).catch((error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
}

function downloadUserAcademicInfoTranscriptAttachment(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, '../academic-uploads') + '/' + req.body.userId + '/' + req.body.fileName;
      res.sendFile(filePath);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  createUserAcademicInfo,
  getUserAcademicInfoByUserId,
  getAcademicChartData,
  updateUserAcademicInfo,
  updateUserAcademicInfoExam,
  updateUserAcademicInfoExamStudentRemark,
  updateUserAcademicInfoMotivationMonitor,
  createUserAcademicInfoSubject,
  updateUserAcademicInfoSubject,
  getUserAcademicSubjectInfoById,
  updateUserAcademicInfoTranscriptAttachment,
  downloadUserAcademicInfoTranscriptAttachment
};
