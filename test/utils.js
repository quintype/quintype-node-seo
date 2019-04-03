const {SEO} = require("..");
const assert = require('assert');

exports.getSeoMetadata = function getSeoMetadata(seoConfig, config, pageType, data, opts) {
  return new SEO(seoConfig)
    .getMetaTags(config, pageType, data, opts)
    .toString();
}

exports.assertContains = function assertContains(expected, actual) {
  assert(actual.includes(expected), `Expected ${actual} to contain ${expected}`);
}

exports.assertDoesNotContains = function assertDoesNotContains(expected, actual) {
  assert.notEqual(actual, expected, `Expected ${actual} does not to contain ${expected}`);
}