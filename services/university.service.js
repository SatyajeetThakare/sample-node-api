const University = require('../models/University')

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function createUniversity(university) {
  return new Promise((resolve, reject) => {
    try {

      University.create(university, function (error, doc) {
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

function updateUniversity(req) {
  return new Promise((resolve, reject) => {
    try {
      delete req.body._id;
      const query = {
        _id: req.params.id
      };
      const update = req.body;
      const options = { upsert: true };
      University.updateOne(query, update, function (error, doc) {
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

function getUniversities() {
  return new Promise((resolve, reject) => {
    try {
      University.find({ 'isActive': true }).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          doc.sort((a,b) => (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : ((b.name.toLowerCase() > a.name.toLowerCase()) ? -1 : 0))
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getUniversityById(universityId) {
  return new Promise((resolve, reject) => {
    try {
      University.findOne({ _id: universityId, 'isActive': true }).exec(function (error, doc) {
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
  createUniversity,
  updateUniversity,
  getUniversities,
  getUniversityById
};
