/* global describe,it */
'use strict';

//TODO: Tests for all Demands API paths

var should = require('should'),
    app = require('../../../server'),
    config = require('../../../server/config/config'),
    lo = require('lodash'),
    fs = require('fs'),
    request = require('supertest');

var apiPath = '/api/v1/demands';

describe('GET '+ apiPath, function() {
  it('Should respond with array of regions', function(done) {
    request(app)
      .get(apiPath + '/')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.instanceof(Array)
          .and.have.lengthOf(2907);
        done();
      });
  });
});

describe('GET '+ apiPath + '/summary', function() {
  it('Should respond with summary of demands', function(done) {
    request(app)
      .get(apiPath + '/summary')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res) {
        if (err) { return done(err); }
        res.body.should.be.instanceof(Array)
          .and.have.lengthOf(96);
        done();
      });
  });
});


describe('GET '+ apiPath + '/region/{region}', function() {
  var filePath = config.dataPath + 'regions.json';

  var regions = JSON.parse(
    fs.readFileSync(filePath, {encoding: 'utf8'})
  );

  lo.each(regions, function(region) {
    it('Should respond with demands for region '+ region, function(done) {
      request(app)
        .get(apiPath + '/region/' + region)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) { return done(err); }
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });
});


describe('GET '+ apiPath + '/county/{county}', function() {
  var filePath = config.dataPath + 'counties.json';
  var counties = JSON.parse(
    fs.readFileSync(filePath, {encoding: 'utf8'})
  );

  //Just use a sample 10 counties because there are so many
  var randCounties = lo.sample(counties, 10);

  lo.each(randCounties, function(county) {
    it('Should respond with demands for '+ county + ' County', function(done) {
      request(app)
        .get(apiPath + '/county/' + county)
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) { return done(err); }
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });
});
