'use strict';

describe('Service: Yearservice', function () {

  // load the service's module
  beforeEach(module('iswpApp'));

  // instantiate service
  var Yearservice;
  beforeEach(inject(function (_Yearservice_) {
    Yearservice = _Yearservice_;
  }));

  it('should do something', function () {
    expect(!!Yearservice).toBe(true);
  });

});
