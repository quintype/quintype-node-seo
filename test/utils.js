const { SEO } = require("..");
const assert = require("assert");
const { structuredDataTest } = require("structured-data-testing-tool");
const { Google, Twitter, Facebook } = require("structured-data-testing-tool/presets");

exports.getSeoMetadata = function getSeoMetadata(seoConfig, config, pageType, data, opts) {
  return new SEO(seoConfig).getMetaTags(config, pageType, data, opts).toString();
};

exports.assertContains = function assertContains(expected, actual) {
  assert(actual.includes(expected), `Expected ${actual} to contain ${expected}`);
};

exports.assertDoesNotContains = function assertDoesNotContains(expected, actual) {
  assert(!actual.includes(expected), `Expected ${actual} not to contain ${expected}`);
};

exports.testSchema = async (url, schemas, addPreset = true) => {
  var result;
  const obj = {};
  if (addPreset) {
    // Check for compliance with Google, Twitter and Facebook recommendations
    obj.presets = [Google, Twitter, Facebook];
  }
  if (schemas.length > 0) {
    // Check the page includes a specific Schema (see https://schema.org/docs/full.html for a list)
    obj.schemas = schemas;
  }
  return structuredDataTest(url, obj)
    .then((res) => {
      console.log("✅ All tests passed!");
      return res;
    })
    .catch((err) => {
      if (err.type === "VALIDATION_FAILED") {
        console.log("❌ Some tests failed.");
        result = err.res;
      } else {
        console.log(err); // Handle other errors here (e.g. an error fetching a URL)
        return err;
      }
      return result;
    });
};
