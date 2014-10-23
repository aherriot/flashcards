'use strict';

describe('Service: Word', function () {

  // load the service's module
  beforeEach(module('flashcardsApp'));

  // instantiate service
  var Word;
  beforeEach(inject(function (_Word_) {
    Word = _Word_;
  }));

  it('should do something', function () {
    expect(!!Word).toBe(true);
  });

});
