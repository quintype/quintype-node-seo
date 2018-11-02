const { StaticTags } = require("..");
const { getSeoMetadata, assertContains } = require("./utils");

const assert = require("assert");
const url = require("url");

describe("StaticTags", function() {
  it("should return a list of static tags", function() {
    const seoConfig = {
      generators: [StaticTags],
      staticTags: { "twitter:site": "@Quintype_inc" }
    };
    const string = getSeoMetadata(seoConfig, {}, "home-page", {});
    assert.equal('<meta name="twitter:site" content="@Quintype_inc"/>', string);
  });

  it("supports other twitter attributes", function() {
    const seoConfig = {
      generators: [StaticTags],
      staticTags: { "google-play-app": "my-play-app" }
    };
    const string = getSeoMetadata(seoConfig, {}, "home-page", {});
    assert.equal(
      '<meta name="google-play-app" content="my-play-app"/>',
      string
    );
  });

  it("converts og tags to meta property", function() {
    const seoConfig = {
      generators: [StaticTags],
      staticTags: { "og:site_name": "Quintype" }
    };
    const string = getSeoMetadata(seoConfig, {}, "home-page", {});
    assert.equal('<meta property="og:site_name" content="Quintype"/>', string);
  });

  it("removes undefined keys", function() {
    const seoConfig = {
      generators: [StaticTags],
      staticTags: { "og:site_name": undefined }
    };
    const string = getSeoMetadata(seoConfig, {}, "home-page", {});
    assert.equal("", string);
  });
});
