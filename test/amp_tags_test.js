const { StoryAmpTags } = require("..");
const { getSeoMetadata, assertContains } = require("./utils");

const assert = require("assert");

describe("ImageTags", function() {
  const seoConfig = {
    generators: [StoryAmpTags],
    ampStoryPages: true
  };

  const config = {};

  it("gets amp tags for supported stories", function() {
    const story = { slug: "section/slug", "is-amp-supported": true };
    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      {}
    );
    assertContains(
      '<link rel="amphtml" href="/amp/story/section%2Fslug"/>',
      string
    );
  });

  it("does not ampify any non supported stories", function() {
    const story = { slug: "section/slug", "is-amp-supported": false };
    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      {}
    );
    assert.equal("", string);
  });

  it("does not ampify other pages", function() {
    const story = { slug: "section/slug", "is-amp-supported": false };
    const string = getSeoMetadata(
      seoConfig,
      config,
      "home-page",
      { data: { story: story } },
      {}
    );
    assert.equal("", string);
  });
});
