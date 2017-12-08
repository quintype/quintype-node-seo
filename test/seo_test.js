const {SEO, StaticTags} = require("..");

var assert = require('assert');

function getSeoMetadata(seoConfig, config, pageType, data) {
  return new SEO(seoConfig)
    .getMetaTags(config, pageType, data)
    .toString();
}

describe('SEO', function() {
  describe('StaticTags', function() {
    it('should return a list of static tags', function() {
      const seoConfig = {
        generators: [StaticTags],
        staticTags: { "twitter:site": "@Quintype_inc" }
      };
      const string = getSeoMetadata(seoConfig, {}, 'home-page', {});
      assert.equal('<meta name="twitter:site" content="@Quintype_inc"/>', string);
    });

    it('supports other twitter attributes', function() {
      const seoConfig = {
        generators: [StaticTags],
        staticTags: { "google-play-app": "my-play-app" }
      };
      const string = getSeoMetadata(seoConfig, {}, 'home-page', {});
      assert.equal('<meta name="google-play-app" content="my-play-app"/>', string);
    });

    it('converts og tags to meta property', function() {
      const seoConfig = {
        generators: [StaticTags],
        staticTags: { "og:site_name": "Quintype" }
      };
      const string = getSeoMetadata(seoConfig, {}, 'home-page', {});
      assert.equal('<meta property="og:site_name" content="Quintype"/>', string);
    });

    it('removes undefined keys', function() {
      const seoConfig = {
        generators: [StaticTags],
        staticTags: { "og:site_name": undefined }
      };
      const string = getSeoMetadata(seoConfig, {}, 'home-page', {});
      assert.equal('', string);
    })
  });
});
