/*global describe,it*/
'use strict';
var assert = require('assert'),
  codeevalRunner = require('../lib/codeeval-runner.js');

describe('codeeval-runner node module.', function() {
  it('must be awesome', function() {
    assert( codeevalRunner .awesome(), 'awesome');
  });
});
