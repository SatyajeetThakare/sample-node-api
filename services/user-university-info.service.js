const UserUniversityInfo = require('../models/UserUniversitiesInfo');
const UserTaskInfoService = require('../services/user-task-info.service');

const get = function (_id) {
  return getAll().find(account => account._id == _id);
}

const getAll = function () {
  return data.Accounts;
}

function createUserUniversityInfo(user) {
  return new Promise((resolve, reject) => {
    try {

      let universityList = [{
        category: 'dream', universityList: []
      }, {
        category: 'target', universityList: []
      }, {
        category: 'safety', universityList: []
      }];

      let userUniversityInfo = {
        universities: universityList,
        user: user._id
      };

      UserUniversityInfo.create(userUniversityInfo, function (error, doc) {
        if (error) {
          console.log('Error in university creation');
          reject(error);
        } else {
          console.log('User university created');
          resolve(doc);
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

function getUserUniversityInfo(id) {
  return new Promise((resolve, reject) => {
    try {
      var query = { user: id }
      UserUniversityInfo.findOne(query).exec(async function (error, doc) {
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

function getUserUniversityById(data) {
  return new Promise(async (resolve, reject) => {
    try {

      userId = data.userId;
      universityId = data.universityId;

      let userUniversityInfo = await UserUniversityInfo.find(
        { user : userId },
        { universities : { $elemMatch : { universityList : { $elemMatch : { _id: universityId } } } } }
      )
      // console.log('userUniversityInfo', userUniversityInfo, userUniversityInfo[0]);
      let extractedUniversityInfo = userUniversityInfo[0].universities[0].universityList.find(e => e._id === universityId);
      let userUniversityData = {
        userId: userId,
        _id: userUniversityInfo[0].universities[0]._id,
        category: userUniversityInfo[0].universities[0].category,
        universityInfo: extractedUniversityInfo
      }
      // console.log('userUniversityData', userUniversityData);
      resolve(userUniversityData);
    } catch (error) {
      reject(error);
    }
  });
}

function updateUserUniversityInfo(req) {
  return new Promise(async (resolve, reject) => {
    try {

      const query = {
        user: req.body.userId,
        universities : { $elemMatch : { universityList : { $elemMatch : { _id: req.body.data._id } } } }
      };
      const update = {
        $set: { "universities.$[i].universityList.$[j]": req.body.data }
      };
      const filters = {
        arrayFilters: [{ "i.category": req.body.category }, { "j._id": req.body.data._id }]
      };

      UserUniversityInfo.findOneAndUpdate(query, update, filters).exec(function (error, doc) {
        if (error) {
          reject(error);
        } else {
          // console.log('doc', doc);
          resolve(doc);
        }
      });
    } catch (error) {
      console.log('doc', doc);
      reject(error);
    }
  });
}

var userId;
function updateUserUniversities(data) {
  return new Promise(async (resolve, reject) => {
    try {

      userId = data.userId;
      let universityInfo = await getUserUniversityInfo(userId);
      // console.log('universityInfo', universityInfo);
      let currentUniersityExist = await uniersityExistCheck(data, universityInfo);
      // console.log('currentUniersityExist', currentUniersityExist);
      resolve(universityInfo);
    } catch (error) {
      reject(error);
    }
  });
}

function uniersityExistCheck(universitiesSelection, userUniversityObj) {
  return new Promise(async (resolve, reject) => {
    try {

      universitiesSelection.universityList.forEach(async element => {
        var universityAdded = false; 
        userUniversityObj.universities.forEach(async (universityCategoryElement, index) => {
          
          if (universityCategoryElement.category != universitiesSelection.category && !universityAdded) {
            let universityMatch = universityCategoryElement.universityList.find(e =>  e._id == element._id);
            // console.log('universityMatch', universityMatch);
            if (universityMatch) {
              let validUniversityObj = Object.keys(universityMatch).length != 0;
              // console.log('validUniversityObj', validUniversityObj);
              if(validUniversityObj) { // If university exists in another category, then fetch it and remove it
                universityAdded = true;
                let universityToBeMoved = universityMatch;
                let removeUniversity = await removeExistingUniversity(universityToBeMoved, index);
                // console.log('Hi');
                let addToDifferentUniversity = await addUniversityToDifferentCategory(universityToBeMoved, universitiesSelection.category);
                // console.log('University found and modified');
              }
            }
          }
        });
        if (!universityAdded) {
          // console.log('University not found');
          let addToDifferentUniversity = await addUniversityToDifferentCategory(element, universitiesSelection.category);
        }
      });

      resolve(true);
      
    } catch (error) {
      reject(error);
    }
  });
}

function removeExistingUniversity(universityToBeMoved, index){
  return new Promise(async (resolve, reject) => {
    try {
      var query = {
        user: userId
      };

      UserUniversityInfo.update(
        { user: userId },
        { $pull : { [`universities.${index}.universityList`] : { "_id": universityToBeMoved._id } } }, function (error, doc) {
          if (error) {
            reject(error);
          } else {
            resolve(doc);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
}

function addUniversityToDifferentCategory(universityToBeMoved, categoryName){
  return new Promise(async (resolve, reject) => {
    try {

      var query = {
        user: userId,
        "universities.category": categoryName
      };

      UserUniversityInfo.updateOne(query,
      {
        $push: {
          "universities.$[elem].universityList": universityToBeMoved
        }
      },
      {
        arrayFilters: [
          { "elem.category": categoryName }
        ]
      }, function (error, doc) {
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

function groupWiseUniversityList() {
  return [{
    category: 'dream', universityList: []
  }, {
    category: 'target', universityList: []
  }, {
    category: 'safety', universityList: []
  }];
}

function deleteUserUniversityInfo(req){
  return new Promise(async (resolve, reject) => {
    try {
      userId = Number(req.body.userId);
      const universityToBeMoved = {
        _id: req.body._id
      }
      const index = req.body.index;
      let removeUniversityResult = await removeExistingUniversity(universityToBeMoved, index);
      resolve(removeUniversityResult);
    } catch(error) {
      reject(error);
    }
  });
}

function changeUserUniversityListSequence(req){
  return new Promise(async (resolve, reject) => {
    try {
      const query = { };
      const update = { $set: { "universities.$[elem].category": 'safety' } };
      const filter = {
        arrayFilters: [
          { "elem.category": 'reach' }
        ]
      };
      UserUniversityInfo.updateMany(query, update, filter, async function (error, doc) {
        if (error) {
          reject(error);
        } else {
          let changeArrayElementPositionResult = await changeArrayElementPosition();
          // changeArrayElementPositionResult.forEach(ele => {
          //   const query1 = { _id: ele };
          //   UserUniversityInfo.updateMany(query1, update, filter, async function (error, doc) {
          //     if (error) {
          //       reject(error);
          //     } else {
          //       let changeArrayElementPositionResult = await changeArrayElementPosition();
          //       changeArrayElementPositionResult.forEach(ele => {
          //         UserUniversityInfo.findOne()
          //       });
          //       resolve(changeArrayElementPositionResult);
          //     }
          //   });
          // });
          resolve(changeArrayElementPositionResult);
          // resolve(doc);
        }
      });
    } catch(error) {
      reject(error);
    }
  });
}

function changeArrayElementPosition(){
  return new Promise(async (resolve, reject) => {
    try {
      const query = { };
      const update = { $set: { "universities": groupWiseUniversityList() } };
      UserUniversityInfo.updateMany(query, update, function (error, doc) {
        if (error) {
          reject(error);
        } else {
          resolve(doc);
        }
      });
    } catch(error) {
      reject(error);
    }
  });
}

module.exports = {
  getUserUniversityInfo,
  updateUserUniversityInfo,
  deleteUserUniversityInfo,
  updateUserUniversities,
  getUserUniversityById,
  createUserUniversityInfo,
  changeUserUniversityListSequence
};
