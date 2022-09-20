const AffiliatedInstitution = require('../models/AffiliatedInstitution')

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function createAffiliatedInstitution(affiliatedInstitution) {
  return new Promise((resolve, reject) => {
    try {
      AffiliatedInstitution.create(affiliatedInstitution, function (error, doc) {
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

function updateAffiliatedInstitution(affiliatedInstitution) {
  return new Promise((resolve, reject) => {
    try {
      AffiliatedInstitution.findByIdAndUpdate(affiliatedInstitution._id,
        affiliatedInstitution, { new: true },
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

function deleteAffiliatedInstitution(affiliatedInstitution) {
  return new Promise((resolve, reject) => {
    try {
      AffiliatedInstitution.update({ '_id': affiliatedInstitution._id },
        { $set: { 'isActive': false, remarks: affiliatedInstitution.remarks || 'Deleted' } },
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

function getAffiliatedInstitutionById(id) {
  return new Promise((resolve, reject) => {
    try {
      AffiliatedInstitution.findById(id).exec(function (error, doc) {
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

function getAffiliatedInstitutions() {
  return new Promise((resolve, reject) => {
    try {
      AffiliatedInstitution.find({ 'isActive': true }).exec(function (error, doc) {
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
  createAffiliatedInstitution,
  updateAffiliatedInstitution,
  deleteAffiliatedInstitution,
  getAffiliatedInstitutionById,
  getAffiliatedInstitutions
};
