'use strict';

describe('Service: Placesservice', function () {

  // load the service's module
  beforeEach(module('iswpApp'));

  // instantiate service
  var Placesservice;
  beforeEach(inject(function (_Placesservice_) {
    Placesservice = _Placesservice_;
  }));

  it('should do something', function () {
    expect(!!Placesservice).toBe(true);
  });

});
