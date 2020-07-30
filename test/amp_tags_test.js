const {StoryAmpTags} = require("..");
const {getSeoMetadata, assertContains} = require("./utils");

const assert = require('assert');

describe('AmpTags', function() {
  const seoConfig = {
    generators: [StoryAmpTags],
    ampStoryPages: true
  }

  const config = {
    'sketches-host': 'https://madrid.quintype.io'
  }

  it("gets amp tags for supported stories", function() {
    const story = {"slug": "section/slug", "is-amp-supported": true}
    const string = getSeoMetadata(seoConfig, config, 'story-page', {data: {story: story}}, {})
    assertContains('<link rel="amphtml" href="/amp/story/section/slug"/>', string);
  });

  it("does not ampify any non supported stories", function() {
    const story = {"slug": "section/slug", "is-amp-supported": false}
    const string = getSeoMetadata(seoConfig, config, 'story-page', {data: {story: story}}, {})
    assert.equal('', string);
  });

  it("does not add amphtml link tag to amp story pages", function() {
    const story = {"slug": "section/slug", "is-amp-supported": true}
    const string = getSeoMetadata(seoConfig, config, 'story-page-amp', {data: {story: story}}, {})
    assert.equal('', string);
  });

  it("does not ampify other pages", function() {
    const string = getSeoMetadata(seoConfig, config, 'home-page', {data: {}}, {})
    assert.equal('', string);
  });

  it("does allows you to only ampify free story pages", function () {
    const story = { "slug": "section/slug", "is-amp-supported": true }
    const publicStoryResults = getSeoMetadata({...seoConfig, ampStoryPages: "public"}, config, 'story-page', { data: { story: story } }, {})
    assert.equal('<link rel="amphtml" href="/amp/story/section/slug"/>', publicStoryResults);
    const privateStoryResults = getSeoMetadata({ ...seoConfig, ampStoryPages: "public" }, config, 'story-page', { data: { story: {...story, access: "subscription"} } }, {})
    assert.equal('', privateStoryResults);
  })
  
  it("does not append domain to amp stories if appendHostToAmpUrl not present", function () {
    const story = {"slug": "section/slug", "is-amp-supported": true}
    const string = getSeoMetadata(seoConfig, config, 'story-page', {data: {story: story}}, {})
    assertContains('<link rel="amphtml" href="/amp/story/section/slug"/>', string);
  })

  it("does append domain to amp stories if appendHostToAmpUrl present", function () {
    const story = {"slug": "section/slug", "is-amp-supported": true}
    const string = getSeoMetadata({...seoConfig, appendHostToAmpUrl: true}, config, 'story-page', {currentHostUrl: "https://madrid.quintype.io/section/slug", data: {story}}, {})
    assertContains('<link rel="amphtml" href="https://madrid.quintype.io/amp/story/section/slug"/>', string);
  })
});
