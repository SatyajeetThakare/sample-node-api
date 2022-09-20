const Subject = require('../models/Subject')

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function createSubject(subject) {
  return new Promise((resolve, reject) => {
    try {
      Subject.create(subject, function (error, doc) {
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

function updateSubject(req) {
  return new Promise((resolve, reject) => {
    try {
      try {
        delete req.body._id
      } catch (error) {
        
      }
      Subject.findByIdAndUpdate(req.params.id,
        req.body, { new: true },
        function (error, doc) {
          if (error) {
            reject(error);
          } else {
            console.log('doc', doc);
            resolve(doc);
          }
        });
    } catch (error) {
      reject(error);
    }
  });
}

function deleteSubject(subject) {
  return new Promise((resolve, reject) => {
    try {
      Subject.update({ '_id': subject._id },
        { $set: { 'isActive': false, remarks: subject.remarks || 'Deleted' } },
        function (error, doc) {
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

function getSubjectById(id) {
  return new Promise((resolve, reject) => {
    try {
      Subject.findById(id).exec(function (error, doc) {
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

function getSubjects() {
  return new Promise((resolve, reject) => {
    try {
      Subject.find({ 'isActive': true }).exec(function (error, doc) {
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

function getSubjectsByBoardId(req) {
  return new Promise((resolve, reject) => {
    try {
      Subject.find({ board: req.params.boardId, 'isActive': true }).exec(function (error, doc) {
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

module.exports = {
  get,
  getAll,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectById,
  getSubjects,
  getSubjectsByBoardId
};
