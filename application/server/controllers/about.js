'use strict';

/**
 * Send About page
 */
exports.about = function(req, res) {
  res.render('about', {pageName: 'about'});
};

/**
 * Send API Description page
 */
exports.api = function(req, res) {
  res.render('apihelp', {pageName: 'apihelp'});
};
