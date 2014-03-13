'use strict';


/**
 * Send 404 page
 */
exports.index = function(req, res) {
  res.status(404);
  res.render('404');
};
