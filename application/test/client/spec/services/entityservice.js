'use strict';

describe('Service: EntityService', function () {

  // load the service's module
  beforeEach(module('iswpApp'));

  // instantiate service
  var EntityService;
  beforeEach(inject(function (_EntityService_) {
    EntityService = _EntityService_;
  }));

  it('should do something', function () {
    expect(!!EntityService).toBe(true);
  });

});
