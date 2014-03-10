'use strict';

describe('Service: YearService', function () {

  // load the service's module
  beforeEach(module('iswpApp'));

  // instantiate service
  var YearService;
  beforeEach(inject(function (_YearService_) {
    YearService = _YearService_;
  }));

  it('should do something', function () {
    expect(!!YearService).toBe(true);
  });

});
