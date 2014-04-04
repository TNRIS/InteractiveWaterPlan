'use strict';

/**
 * Send About page
 */
exports.about = function(req, res) {
  res.render('about', {pageName: 'about'});
};
