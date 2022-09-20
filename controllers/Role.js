const Roles = require('../models/Role')
const RoleService = require('../services/role.service');

module.exports.createRole = function(req, res, next) {
  try {
    RoleService.createRole(req.body).then((doc) => {
      res.json({ error: false, success: true, message: "Role created successfully", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.getRoleById = function(req, res, next) {
  let _id = req.params.id
  Roles.findById(_id, function(err, doc) {
    if (err) return handleError(err, req, res, next)
    else
      res.json({
        success: true,
        error: false,
        message: 'Role fetched successfully',
        data: doc
      })

  })
}

module.exports.updateRole = function(req, res, next) {
  let _id = req.params.id
  let role = req.body
  Roles.findByIdAndUpdate(_id, role, {
    new: true
  }, function(err, doc) {
    if (err) return handleError(err, req, res, next)
    else
      res.json({
        success: true,
        error: false,
        message: 'Role updated',
        data: doc
      })

  })
}

module.exports.getRoles = function(req, res, next) {
  try {
    let _filter = req.query.filter
    let allRole = {}

    if (_filter) {
      allRole = JSON.parse(_filter)
    }

    RoleService.getAllRoles(allRole).then((doc) => {
      res.json({ error: false, success: true, message: "Roles list", data: doc })
    }).catch(error => {
      next(error);
    });
  } catch (error) {
    next(error);
  }
}

module.exports.deleteRole = function(req, res, next) {
  Roles.update({
    '_id': req.params.id
  }, {
    $set: {
      'isActive': false,
      'remarks': req.body.remarks || 'Deleted'
    }
  }, {
    new: true
  }, (err, doc) => {
    if (err) {
      return handleError(err, res, req, next)
    } else {
      res.json({
        success: true,
        error: false,
        message: 'Role deleted successfully',
        data: doc
      });
    }
  });
}
