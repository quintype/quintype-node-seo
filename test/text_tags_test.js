const {TextTags} = require("..");
const {getSeoMetadata, assertContains} = require("./utils");

const assert = require('assert');
const url = require("url");

describe('SEO', function() {
  describe('TextTags', function() {
    it("gets the homepage config", function() {
      const seoConfig = {
        generators: [TextTags],
      }
      const config = {"seo-metadata": [{"owner-type": "home", "data": {'page-title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'home-page', {}, {url: url.parse("/")})
      assertContains('<title>Foobar</title>', string);
    });

    it("does not crash if the metadata is missing", function() {
      const seoConfig = {
        generators: [TextTags],
      }
      const config = {"seo-metadata": []};
      const string = getSeoMetadata(seoConfig, config, 'home-page', {}, {url: url.parse("/")})
      assert.equal('', string);
    });

    it("gets the meta config for the section", function() {
      const seoConfig = {
        generators: [TextTags],
      }
      const config = {"seo-metadata": [{"owner-type": 'section', 'owner-id': 42, data: {'page-title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'section-page', {data: {section: {id: 42}}}, {url: url.parse("/")})
      assertContains('<title>Foobar</title>', string);
    });

    it("defaults to the homepage config if section is not found", function() {
      const seoConfig = {
        generators: [TextTags],
      }
      const config = {"seo-metadata": [{"owner-type": 'home', data: {'page-title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'section-page', {data: {section: {id: 42}}}, {url: url.parse("/")})
      assertContains('<title>Foobar</title>', string);
    });

    it("uses a given title if that is passed instead", function() {
      const seoConfig = {
        generators: [TextTags],
      }
      const config = {"seo-metadata": [{"owner-type": "home", "data": {'page-title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'home-page', {title: "The Title"}, {url: url.parse("/")})
      assertContains('<title>The Title</title>', string);
    });

    it("Alse generates all other fields", function() {
      const seoConfig = {
        generators: [TextTags],
        enableOgTags: true,
        enableTwitterCards: true
      }
      const config = {"seo-metadata": [{"owner-type": "home", "data": {'title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'home-page', {}, {url: url.parse("/")})
      assertContains('<meta name="title" content="Foobar"/>', string);
      assertContains('<meta name="twitter:title" content="Foobar"/>', string);
      assertContains('<meta property="og:title" content="Foobar"/>', string);
    });
  });
});
