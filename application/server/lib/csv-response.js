// Based on https://github.com/darul75/express-json-csv
// MIT License
// Copyright (c) 2013 Julien Valéry

'use strict';
var json2csv = require('json2csv');

module.exports = function(express) {

  express.response.csv = function(obj, options){

    var o = options;

    if (!o || !o.fields)
      return this.send(500, { error: 'options has to be a correct parameter' });
    // content-type
    this.charset = this.charset || 'utf-8';

    // added fileName option
    o.fileName = options.fileName || 'export.csv';

    var app = this.app;
    var replacer = app.get('json replacer');
    var spaces = app.get('json spaces');
    var body = '';
    try {
      JSON.stringify(obj, replacer, spaces);
      o.data = obj;
    }
    catch (err) {
      body = obj;
    }

    var this_ = this;

    if (o.data) {
      json2csv(o, function(err, csv) {
        if (err) return this.send(500, { error: 'bad options param' });

        this_.set('Content-Type', 'text/csv');
        this_.setHeader("Content-Disposition",
          "attachment; filename=" + o.fileName);

        return this_.send(csv);
      });
    }
    else {
      this.send(500, { error: 'no data to convert, check obj param' });
    }

  };
};
