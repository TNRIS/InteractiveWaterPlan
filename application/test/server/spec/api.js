/* global describe,it */
'use strict';

//TODO: A lot more testing
// - needs api
// - demands api
// - entity api
// - places api
// - type api

var should = require('should'),
    app = require('../../../server'),
    request = require('supertest');

var apiPath = '/api/v1/';

describe('GET places/regions', function() {

  it('Should respond with array of regions', function(done) {
    request(app)
      .get(apiPath + 'places/regions')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.instanceof(Array)
          .and.have.lengthOf(16);
        done();
      });
  });

});


describe('GET places/regions.topojson', function() {

  it('Should respond with TopoJSON of regions', function(done) {
    request(app)
      .get(apiPath + 'places/regions.topojson')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.instanceof(Object)
          .and.have.properties([
            'type',
            'transform',
            'objects',
            'arcs',
            'bbox'
          ]);
        done();
      });
  });

});

describe('GET places/counties', function() {

  it('Should respond with array of counties', function(done) {
    request(app)
      .get(apiPath + 'places/counties')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.instanceof(Array)
          .and.have.lengthOf(254);
        done();
      });
  });

});
