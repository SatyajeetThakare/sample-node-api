const Role = require('../models/Role')

function createRole(role) {
  return new Promise((resolve, reject) => {
    try {
      Role.create(role, function (error, doc) {
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

function getAllRoles(allRole) {
  return new Promise((resolve, reject) => {
    try {
      Role.find({ 'isActive': true }).exec(function (error, doc) {
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
    createRole,
    getAllRoles
};
