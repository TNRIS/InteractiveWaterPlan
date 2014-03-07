'use strict';

describe('Controller: MapCtrl', function () {

  // load the controller's module
  beforeEach(module('iswpApp'));

  var MapCtrl,
    scope,
    $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    // $httpBackend.expectGET('/api/awesomeThings')
    //   .respond(['HTML5 Boilerplate', 'AngularJS', 'Karma', 'Express']);
    scope = $rootScope.$new();
    MapCtrl = $controller('MapCtrl', {
      $scope: scope
    });
  }));

  // it('should attach a list of awesomeThings to the scope', function () {
  //   expect(scope.awesomeThings).toBeUndefined();
  //   $httpBackend.flush();
  //   expect(scope.awesomeThings.length).toBe(4);
  // });
});
