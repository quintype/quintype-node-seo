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

exports.testSchema = async (url, schemas) => {
  var result;
  return await structuredDataTest(url, {
    // Check for compliance with Google, Twitter and Facebook recommendations
    presets: [Google, Twitter, Facebook],
    // Check the page includes a specific Schema (see https://schema.org/docs/full.html for a list)
    schemas: schemas,
  })
    .then((res) => {
      console.log("✅ All tests passed!");
      result = res;
    })
    .catch((err) => {
      if (err.type === "VALIDATION_FAILED") {
        console.log("❌ Some tests failed.");
        result = err.res;
      } else {
        console.log(err); // Handle other errors here (e.g. an error fetching a URL)
      }
    })
    .finally(async () => {
      if (result) {
        console.log(
          `Passed: ${result.passed.length},`,
          `Failed: ${result.failed.length},`,
          `Warnings: ${result.warnings.length}`
        );
        console.log(`Schemas found: ${result.schemas.join(",")}`);

        // Loop over validation errors
        if (result.failed.length > 0) {
          console.log(
            "⚠️  Errors:\n",
            result.failed.map((test) => test)
          );
          return await "failed";
        }
      }
      return await "passed";
    });
};
