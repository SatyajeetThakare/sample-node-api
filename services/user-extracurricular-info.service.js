const { link } = require('fs');
const UserExtraCurricularInfo = require('../models/UserExtraCurricularInfo');
const FileUploadService = require('./file-upload.service');
const path = require(`path`);

global.__basedir = __dirname;

function createUserExtraCurricularInfo(user) {
  return new Promise((resolve, reject) => {
    try {
      let userExtraCurricularInfo = {
        user: user._id
      };
      UserExtraCurricularInfo.create(userExtraCurricularInfo, function (error, doc) {
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

function updateUserExtraCurricularInfo(req) {
  return new Promise((resolve, reject) => {
    try {

      const query = { _id: req.body._id };
      let category = req.body.category;
      const update = { $push: { [`${category}`]: req.body.activity } };
      const options = { upsert: true };

      UserExtraCurricularInfo.updateOne(query, update, options).exec(function (error, doc) {
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

function updateUserExtraCurricularInfoCategory(req) {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {
        user: req.body.user
      };
      let category = req.body.category;
      const update = { $set: { [`${category}.$`]: req.body } };
      const options = { upsert: true };

      UserExtraCurricularInfo.update(
        { user: req.body.user, [`${category}`]: { $elemMatch: { _id: req.body._id } } },
        update, options, (error, doc) => {
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

function getUserExtraCurricularInfoByUserId(id) {
  return new Promise((resolve, reject) => {
    try {
      var query = {
        user: id
      };
  
      UserExtraCurricularInfo.findOne(query).exec(async function (error, doc) {
        if (error) {
          reject(error);
        } else {
          if (!doc) {
            createUserExtraCurricularInfo({_id: id}).then((userECDoc) => {
              resolve(userECDoc);
            }).catch(error => {
              reject(error);
            });
          } else {
            // filter only active elements
            doc.academic = doc.academic.filter(e => e.isActive);
            doc.leadership = doc.leadership.filter(e => e.isActive);
            doc.cas = doc.cas.filter(e => e.isActive);
            doc.personalDevelopment = doc.personalDevelopment.filter(e => e.isActive);
            resolve(doc);
          }
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

fileTypes = ['resume', 'coverLetter', 'mentorNetwork'];
function updateUserExtraCurricularInfoAttachments(req) {
  return new Promise(async (resolve, reject) => {
    try {

      // console.log('req.body', req.body, req.file.originalname);
      const fileType = req.body.fileType;

      if (fileTypes.includes(fileType)) {
        if (fileType != 'mentorNetwork') {
          FileUploadService.uploadFile(req, fileType, 'ec-uploads').then(async (filePath) => {

            let docObj = {
              url: filePath,
              fileName: req.file.originalname,
              uploadedOn: new Date()
            }
            const query = { _id: req.body._id };
            const update = {
              $set: { [`attachments.${fileType}`]: docObj }
            }
            // console.log('docObj', docObj, update);
            // Update the collection
            let updateAttachmentsInfoResult = await updateAttachmentsInfo(query, update);
            resolve(updateAttachmentsInfoResult);
          }).catch((error) => {
            console.log('Line no 133: Invalid file type provided');
            reject(error);
          });
        } else {
          let docObj = {
            url: req.body.docUrl,
            fileName: 'Mentor Network',
            uploadedOn: new Date()
          };
          const query = { _id: req.body._id };
          const update = {
            $set: { [`attachments.${fileType}`]: docObj }
          }
          let updateAttachmentsInfoResult = await updateAttachmentsInfo(query, update);
          resolve(updateAttachmentsInfoResult);
        }
      } else {
        reject('Invalid file type provided');
      }

    } catch (error) {
      console.log('Line no 154: Invalid file type provided');
      throw error;
    }
  });
}

function updateAttachmentsInfo(query, update) {
  return new Promise(async (resolve, reject) => {
    try {

      UserExtraCurricularInfo.update(query, update, function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });

    } catch (error) {
      throw error;
    }
  });
}

function downloadUserExtraCurricularInfoAttachments(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const filePath = path.join(__dirname, '../ec-uploads') + '/' + req.body.userId + '/' + req.body.fileName;
      res.sendFile(filePath);
    } catch (error) {
      console.log('error is here', error);
      reject(error);
    }
  });
}

module.exports = {
  createUserExtraCurricularInfo,
  getUserExtraCurricularInfoByUserId,
  updateUserExtraCurricularInfo,
  updateUserExtraCurricularInfoCategory,
  updateUserExtraCurricularInfoAttachments,
  downloadUserExtraCurricularInfoAttachments
};
