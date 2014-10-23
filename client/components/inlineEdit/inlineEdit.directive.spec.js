'use strict';

describe('Directive: inlineEdit', function () {

  // load the directive's module
  beforeEach(module('flashcardsApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<inline-edit></inline-edit>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the inlineEdit directive');
  }));
});