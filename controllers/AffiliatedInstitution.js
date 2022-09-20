const AffiliatedInstitution = require('../models/AffiliatedInstitution')
const AffiliatedInstitutionService = require('../services/affiliated-institution.service');
const constants = require('../constants/constants')
const assert = require('assert')

module.exports.getAffiliatedInstitutions = (req, res, next) => {
  try {
    AffiliatedInstitutionService.getAffiliatedInstitutions().then((doc) => {
      res.json({ error: false, success: true, message: "Affiliated institutions list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.getAffiliatedInstitutionById = (req, res, next) => {
  try {
    AffiliatedInstitutionService.getAffiliatedInstitutionById(req.params.id).then((doc) => {
      res.json({ error: false, success: true, message: "Affiliated institution info", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.createAffiliatedInstitution = (req, res, next) => {
  try {
    let _userInfo = req.session.userInfo;
    AffiliatedInstitutionService.createAffiliatedInstitution(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Affiliated institution created successfully", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.updateAffiliatedInstitution = (req, res, next) => {
  try {
    AffiliatedInstitutionService.updateAffiliatedInstitution(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Affiliated institution updated", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.deleteAffiliatedInstitution = (req, res, next) => {
  try {
    AffiliatedInstitutionService.deleteAffiliatedInstitution(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Affiliated institution deleted", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}