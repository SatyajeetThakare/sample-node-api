const UserExtraCurricularInfoService = require('../services/user-extracurricular-info.service');
const config = require('../config/config');

module.exports.createUserExtraCurricularInfo = (req, res, next) => {
  try {
    UserExtraCurricularInfoService.createUserExtraCurricularInfo(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "User extra curricular info created", data: doc })
    }).catch(error => {
      res.json({ error: false, success: true, message: error.message, data: {} })
    });  
  } catch (error) {
    next(error); 
  }
}

module.exports.updateUserExtraCurricularInfo = (req, res, next) => {
  try {
    UserExtraCurricularInfoService.updateUserExtraCurricularInfo(req).then((doc) => {
      res.json({ error: false, success: true, message: "User extra curricular info modified", data: doc })
    }).catch(error => {
      console.log(error);
      res.json({ error: true, success: false, message: error.message, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.updateUserExtraCurricularInfoCategory = (req, res, next) => {
  try {
    UserExtraCurricularInfoService.updateUserExtraCurricularInfoCategory(req).then((doc) => {
      res.json({ error: false, success: true, message: "User extra curricular category modified", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.getUserExtraCurricularInfoByUserId = (req, res, next) => {
  try {
    UserExtraCurricularInfoService.getUserExtraCurricularInfoByUserId(req.params.id).then((doc) => {
      res.json({ error: false, success: true, message: "User extra curricular info fetched", data: doc })
    }).catch(error => {
      res.json({ error: false, success: true, message: error.message, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.updateUserExtraCurricularInfoAttachments = (req, res, next) => {
  try {
    UserExtraCurricularInfoService.updateUserExtraCurricularInfoAttachments(req).then((doc) => {
      res.json({ error: false, success: true, message: "User extra curricular category modified", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.downloadUserExtraCurricularInfoAttachments = (req, res, next) => {
  try {
    UserExtraCurricularInfoService.downloadUserExtraCurricularInfoAttachments(req, res).then((doc) => {
      res.download(doc);
      // res.json({ error: false, success: true, message: "User extra curricular file downloaded", data: doc })
    }).catch(error => {
      res.json({ error: false, success: true, message: error.message, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}