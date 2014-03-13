'use strict';


/**
 * Send 404 page
 */
exports.index = function(req, res) {
  res.status(404);

  if (req.accepts('html')) {
    res.render('404');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
};
