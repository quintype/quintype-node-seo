const {StoryAmpTags} = require("..");
const {getSeoMetadata, assertContains} = require("./utils");

const assert = require('assert');

describe('ImageTags', function() {
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
    assertContains('<link rel="amphtml" href="/amp/story/section%2Fslug"/>', string);
  });

  it("does not ampify any non supported stories", function() {
    const story = {"slug": "section/slug", "is-amp-supported": false}
    const string = getSeoMetadata(seoConfig, config, 'story-page', {data: {story: story}}, {})
    assert.equal('', string);
  });

  it("does not ampify other pages", function() {
    const string = getSeoMetadata(seoConfig, config, 'home-page', {data: {}}, {})
    assert.equal('', string);
  });

  it("does allows you to only ampify free story pages", function () {
    const story = { "slug": "section/slug", "is-amp-supported": true }
    const publicStoryResults = getSeoMetadata({...seoConfig, ampStoryPages: "public"}, config, 'story-page', { data: { story: story } }, {})
    assert.equal('<link rel="amphtml" href="/amp/story/section%2Fslug"/>', publicStoryResults);
    const privateStoryResults = getSeoMetadata({ ...seoConfig, ampStoryPages: "public" }, config, 'story-page', { data: { story: {...story, access: "subscription"} } }, {})
    assert.equal('', privateStoryResults);
  })
  
  it("does not append domain to amp stories if appendHostToAmpUrl not present", function () {
    const story = {"slug": "section/slug", "is-amp-supported": true}
    const string = getSeoMetadata(seoConfig, config, 'story-page', {data: {story: story}}, {})
    assertContains('<link rel="amphtml" href="/amp/story/section%2Fslug"/>', string);
  })

  it("does append domain to amp stories if appendHostToAmpUrl present", function () {
    const story = {"slug": "section/slug", "is-amp-supported": true}
    const string = getSeoMetadata({...seoConfig, appendHostToAmpUrl: true}, config, 'story-page', {data: {story: story}}, {})
    assertContains('<link rel="amphtml" href="https://madrid.quintype.io/amp/story/section%2Fslug"/>', string);
  })
});
