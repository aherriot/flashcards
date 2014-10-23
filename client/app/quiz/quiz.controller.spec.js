'use strict';

describe('Controller: QuizCtrl', function () {

  // load the controller's module
  beforeEach(module('flashcardsApp'));

  var QuizCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QuizCtrl = $controller('QuizCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
