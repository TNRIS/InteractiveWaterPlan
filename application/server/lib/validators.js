'use strict';

//Middlewares for validation of common parameters

exports.validateRegion = function validateRegion(req, res, next) {
  req.check('region', 'Must be a single letter')
    .notEmpty()
    .isAlpha()
    .len(1,1);

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.status(400).json({errors: errors});
  }

  next();
};

exports.validateCounty = function validateCounty(req, res, next) {
  req.check('county', 'Must be a valid county name')
    .notEmpty();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.status(400).json({errors: errors});
  }

  next();
};

exports.validateEntityId = function validateEntityId(req, res, next) {
  req.check('entityId', 'Must be a valid Water User Group Entity ID')
    .notEmpty()
    .isInt();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.status(400).json({errors: errors});
  }

  next();
};

exports.validateEntityType = function validateEntityType(req, res, next) {
  req.check('entityType', 'Must be a valid Water User Group Entity Type')
    .notEmpty();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.status(400).json({errors: errors});
  }

  next();
};

exports.validateSourceId = function validateSourceId(req, res, next) {
  req.check('sourceId', 'Must be a valid Source ID')
    .notEmpty()
    .isInt();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.status(400).json({errors: errors});
  }

  next();
};


exports.validateSourceIds = function validateSourceIds(req, res, next) {
  req.checkQuery('ids', 'Must be a comma-separated list of ids')
    .notEmpty()
    .isIntList();

  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.status(400).json({errors: errors});
  }

  next();
};
