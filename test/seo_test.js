const {SEO, StaticTags} = require("..");

var assert = require('assert');

function runTest(seoConfig, config, pageType, data) {
  return new SEO(seoConfig)
    .getMetaTags(config, pageType, data)
    .then(tags => tags.toString());
}

describe('SEO', function() {
  describe('StaticTags', function() {
    it('should return a list of static tags', function(done) {
      const seoConfig = {
        generators: [StaticTags],
        staticTags: { "twitter:site": "@Quintype_inc" }
      };
      runTest(seoConfig, {}, 'home-page', {})
        .then(string => assert.equal('<meta name="twitter:site" content="@Quintype_inc"/>', string))
        .then(done)
        .catch(done);
    });

    it('supports other twitter attributes', function(done) {
      const seoConfig = {
        generators: [StaticTags],
        staticTags: { "google-play-app": "my-play-app" }
      };
      runTest(seoConfig, {}, 'home-page', {})
        .then(string => assert.equal('<meta name="google-play-app" content="my-play-app"/>', string))
        .then(done)
        .catch(done);
    });

    it('converts og tags to meta property', function(done) {
      const seoConfig = {
        generators: [StaticTags],
        staticTags: { "og:site_name": "Quintype" }
      };
      runTest(seoConfig, {}, 'home-page', {})
        .then(string => assert.equal('<meta property="og:site_name" content="Quintype"/>', string))
        .then(done)
        .catch(done);
    })
  });
});
