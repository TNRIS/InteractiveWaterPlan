'use strict';

//Middlewares for validation of common parameters

function errOrNext(req, res, next) {
  var errors = req.validationErrors();
  if (errors && errors.length) {
    return res.status(400).json({errors: errors});
  }

  return next();
}

exports.validateRegion = function validateRegion(req, res, next) {
  req.check('region', 'Must be a single letter')
    .notEmpty()
    .isAlpha()
    .len(1,1);

  return errOrNext(req, res, next);
};

exports.validateCounty = function validateCounty(req, res, next) {
  req.check('county', 'Must be a valid county name')
    .notEmpty();

  return errOrNext(req, res, next);
};

exports.validateEntityId = function validateEntityId(req, res, next) {
  req.check('entityId', 'Must be a valid Water User Group Entity ID')
    .notEmpty()
    .isInt();

  return errOrNext(req, res, next);
};

exports.validateEntityType = function validateEntityType(req, res, next) {
  req.check('entityType', 'Must be a valid Water User Group Entity Type')
    .notEmpty();

  return errOrNext(req, res, next);
};

exports.validateSourceId = function validateSourceId(req, res, next) {
  req.check('sourceId', 'Must be a valid Source ID')
    .notEmpty()
    .isInt();

  return errOrNext(req, res, next);
};


exports.validateSourceIds = function validateSourceIds(req, res, next) {
  req.checkQuery('ids', 'Must be a comma-separated list of IDs (max 50)')
    .notEmpty()
    .isIntList(50);

  return errOrNext(req, res, next);
};

exports.validateWmsType = function validateWmsType(req, res, next) {
  req.check('wmsType', 'Must be a valid Strategy Type')
    .notEmpty();

  return errOrNext(req, res, next);
};
