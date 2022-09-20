const UserAcademicInfoService = require('../services/user-academic-info.service');
const config = require('../config/config');

module.exports.getUserAcademicInfoByUserId = (req, res, next) => {
  try {
    UserAcademicInfoService.getUserAcademicInfoByUserId(req.params.id).then((doc) => {
      res.json({ error: false, success: true, message: "User academic subject info fetched", data: doc })
    }).catch(error => {
      res.json({ error: false, success: true, message: error.message || error.errmsg || error.message, data: {} })
    });  
  } catch (error) {
    next(error); 
  }
}

module.exports.getAcademicChartData = (req, res, next) => {
  try {
    UserAcademicInfoService.getAcademicChartData(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic chart data fetched", data: doc })
    }).catch(error => {
      res.json({ error: false, success: true, message: error.error || error.message, data: {} })
    });  
  } catch (error) {
    next(error); 
  }
}

module.exports.updateUserAcademicInfo = (req, res, next) => {
  try {
    UserAcademicInfoService.updateUserAcademicInfo(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic info modified", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.error || error.message, data: {} })
    });
  } catch (error) {
    next(error);
  }
}

module.exports.updateUserAcademicInfoMotivationMonitor = (req, res, next) => {
  try {
    UserAcademicInfoService.updateUserAcademicInfoMotivationMonitor(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic info modified", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
    });
  } catch (error) {
    next(error);
  }
}

module.exports.updateUserAcademicInfoExam = (req, res, next) => {
  try {
    UserAcademicInfoService.updateUserAcademicInfoExam(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic exam modified", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.updateUserAcademicInfoExamStudentRemark = (req, res, next) => {
  try {
    UserAcademicInfoService.updateUserAcademicInfoExamStudentRemark(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic student remark updated", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.getUserAcademicSubjectInfoById = (req, res, next) => {
  try {
    UserAcademicInfoService.getUserAcademicSubjectInfoById(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic subject info fetched", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.createUserAcademicInfoSubject = (req, res, next) => {
  try {
    UserAcademicInfoService.createUserAcademicInfoSubject(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic info modified", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.updateUserAcademicInfoSubject = (req, res, next) => {
  try {
    UserAcademicInfoService.updateUserAcademicInfoSubject(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic info modified", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error.errmsg, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.updateUserAcademicInfoTranscriptAttachment = (req, res, next) => {
  try {
    UserAcademicInfoService.updateUserAcademicInfoTranscriptAttachment(req).then((doc) => {
      res.json({ error: false, success: true, message: "User academic transcript file uploaded", data: doc })
    }).catch(error => {
      res.json({ error: true, success: false, message: error.message || error, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}

module.exports.downloadUserAcademicInfoTranscriptAttachment = (req, res, next) => {
  try {
    UserAcademicInfoService.downloadUserAcademicInfoTranscriptAttachment(req, res).then((doc) => {
      res.download(doc);
    }).catch(error => {
      res.json({ error: false, success: true, message: error.message, data: {} })
    });
  } catch (error) {
    next(error); 
  }
}