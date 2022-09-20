const Subject = require('../models/Subject')
const SubjectService = require('../services/subject.service');
const constants = require('../constants/constants')
const assert = require('assert');
const { model } = require('../models/Subject');

module.exports.getSubjects = (req, res, next) => {
  try {
    SubjectService.getSubjects().then((doc) => {
      res.json({ error: false, success: true, message: "Subjects list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.getSubjectsByBoardId = (req, res, next) => {
  try {
    SubjectService.getSubjectsByBoardId(req).then((doc) => {
      res.json({ error: false, success: true, message: "Subjects list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.getSubjectById = (req, res, next) => {
  try {
    SubjectService.getSubjectById(req.params.id).then((doc) => {
      res.json({ error: false, success: true, message: "Subject info", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.createSubject = (req, res, next) => {
  try {
    let _userInfo = req.session.userInfo;
    SubjectService.createSubject(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Subject created successfully", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.createSubjectArray = (req, res, next) => {
  try {
    let errorArray = [];
    req.body.forEach((element, index) => {
      SubjectService.createSubject(element).then((doc) => { }).catch(error => {
        console.log('error', error);
        errorArray.push(error);

        if (req.body.length - 1 === index) {
          res.json({ error: false, success: true, message: "Subjects created successfully", data: [] })
        }
      });
    });
    console.log('errorArray', errorArray);
  } catch (error) {
    next(error);
  }
}

module.exports.updateSubject = (req, res, next) => {
  try {
    SubjectService.updateSubject(req).then((doc) => {
      res.json({ error: false, success: true, message: "Subject updated succesfully", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.deleteSubject = (req, res, next) => {
  try {
    SubjectService.deleteSubject(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Subjects list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}