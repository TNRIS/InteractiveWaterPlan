'use strict';

describe('Service: NeedsService', function () {

  // load the service's module
  beforeEach(module('iswpApp'));

  // instantiate service
  var NeedsService;
  beforeEach(inject(function (_NeedsService_) {
    NeedsService = _NeedsService_;
  }));

  it('should do something', function () {
    expect(!!NeedsService).toBe(true);
  });

});
