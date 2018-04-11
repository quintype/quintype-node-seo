const {TextTags, SEO} = require("..");
const {getSeoMetadata, assertContains} = require("./utils");

const assert = require('assert');
const url = require("url");

describe('TextTags', function() {
  describe('Home And Section Page', function() {
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
      const config = {"sketches-host": "http://foo.com", "seo-metadata": [{"owner-type": "home", "data": {'title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'home-page', {}, {url: url.parse("/")})
      assertContains('<meta name="title" content="Foobar"/>', string);
      assertContains('<meta name="twitter:title" content="Foobar"/>', string);
      assertContains('<meta property="og:title" content="Foobar"/>', string);
      assertContains('<link rel="canonical" href="http://foo.com/"/>', string);
    });
  });

  describe('Story Page', function() {
    it("Generates SEO tags for a story page", function () {
      const seoConfig = {
        generators: [TextTags],
      }
      const story = {headline: "Foobar", summary: "Some Foobar", tags: [{name: "Footag"}], slug: "politics/awesome"}
      const string = getSeoMetadata(seoConfig, {"sketches-host": "http://foo.com"}, 'story-page', {data: {story: story}}, {url: url.parse("/my-page")})
      assertContains('<title>Foobar</title>', string);
      assertContains('<meta name="title" content="Foobar"/>', string);
      assertContains('<meta name="description" content="Some Foobar"/>', string);
      assertContains('<meta name="keywords" content="Footag"/>', string);
      assertContains('<link rel="canonical" href="http://foo.com/politics/awesome"/>', string);
    });



    it("Generates SEO tags for a card in story page", function () {
      const seoConfig = {
        generators: [TextTags],
        enableOgTags: true
      };

      const story = {
        headline: "Foobar",
        summary: "Some Foobar",
        tags: [{name: "Footag"}],
        slug: "politics/awesome",
        "hero-image-s3-key": "my/image.png",
        "cards" : [
          {
            "id" : "sample-card-id",
            "metadata" : {
              "social-share": {
                "title": "share-card-title",
                "message": "share-card-description",
                "image": {
                  "key": "my/card/image.jpg",
                  "metadata": {
                    "width": 1300,
                    "height": 1065,
                    "mime-type": "image/jpeg"
                  }
                }
              }
            }
          }
        ]
      };

      const opts = {
        url : {
          query : {
            cardId : 'sample-card-id'
          }
        }
      };

      const string = getSeoMetadata(seoConfig, {"sketches-host": "http://foo.com"}, 'story-page', {data: {story: story}}, opts);
      assertContains('<title>Foobar</title>', string);
      assertContains('<meta name="title" content="share-card-title"/>', string);
      assertContains('<meta name="description" content="share-card-description"/>', string);
      assertContains('<meta name="keywords" content="Footag"/>', string);
      assertContains('<link rel="canonical" href="http://foo.com/politics/awesome"/>', string);
      assertContains('<meta property="og:url" content="http://foo.com/politics/awesome?cardId=sample-card-id"/>', string);
    });


    it("gets story data as fallback if the card metadata is falsy", function () {
      const seoConfig = {
        generators: [TextTags],
      };

      const story = {
        headline: "Foobar",
        summary: "Some Foobar",
        tags: [{name: "Footag"}],
        slug: "politics/awesome",
        "hero-image-s3-key": "my/image.png",
        "cards" : [
          {
            "id" : "sample-card-id",
            "metadata" : {
              "social-share": {
                "title": undefined,
                "message": "",
                "image": {
                  "key": "my/card/image.jpg",
                  "metadata": {
                    "width": 1300,
                    "height": 1065,
                    "mime-type": "image/jpeg"
                  }
                }
              }
            }
          }
        ]
      };

      const opts = {
        url : {
          query : {
            cardId : 'sample-card-id'
          }
        }
      };

      const string = getSeoMetadata(seoConfig, {"sketches-host": "http://foo.com"}, 'story-page', {data: {story: story}}, opts);
      assertContains('<title>Foobar</title>', string);
      assertContains('<meta name="title" content="Foobar"/>', string);
      assertContains('<meta name="description" content="Some Foobar"/>', string);
      assertContains('<meta name="keywords" content="Footag"/>', string);
      assertContains('<link rel="canonical" href="http://foo.com/politics/awesome"/>', string);
    });


    it("gets story data as fallback if card id is improper", function () {
      const seoConfig = {
        generators: [TextTags],
      };

      const story = {
        headline: "Foobar",
        summary: "Some Foobar",
        tags: [{name: "Footag"}],
        slug: "politics/awesome",
        "hero-image-s3-key": "my/image.png",
        "cards" : [
          {
            "id" : "sample-card-id",
            "metadata" : {
              "social-share": {
                "title": "share-card-title",
                "message": "share-card-description",
                "image": {
                  "key": "my/card/image.jpg",
                  "metadata": {
                    "width": 1300,
                    "height": 1065,
                    "mime-type": "image/jpeg"
                  }
                }
              }
            }
          }
        ]
      };

      const opts = {
        url : {
          query : {
            cardId : 'sample-card-id-bad'
          }
        }
      };

      const string = getSeoMetadata(seoConfig, {"sketches-host": "http://foo.com"}, 'story-page', {data: {story: story}}, opts);
      assertContains('<title>Foobar</title>', string);
      assertContains('<meta name="title" content="Foobar"/>', string);
      assertContains('<meta name="description" content="Some Foobar"/>', string);
      assertContains('<meta name="keywords" content="Footag"/>', string);
      assertContains('<link rel="canonical" href="http://foo.com/politics/awesome"/>', string);
    });




    it("Overrides the canonical url", function () {
      const seoConfig = {
        generators: [TextTags],
      }
      const story = {'canonical-url': "http://foobar.com/mystory"}
      const string = getSeoMetadata(seoConfig, {"sketches-host": "http://foo.com"}, 'story-page', {data: {story: story}}, {url: url.parse("/my-page")})
      assertContains('<link rel="canonical" href="http://foobar.com/mystory"/>', string);
    });

    it("Overrides the canonical meta title and description", function () {
      const seoConfig = {
        generators: [TextTags],
      }
      const story = {seo: {"meta-title": "Foobar", "meta-description": "Some Foobar", "meta-keywords": ["Footag"]}, tags: []}
      const string = getSeoMetadata(seoConfig, {"sketches-host": "http://foo.com"}, 'story-page', {data: {story: story}}, {url: url.parse("/my-page")})
      assertContains('<meta name="title" content="Foobar"/>', string);
      assertContains('<meta name="description" content="Some Foobar"/>', string);
      assertContains('<meta name="keywords" content="Footag"/>', string);
    });

    it("Can generate news tags", function() {
      const seoConfig = {
        generators: [TextTags],
        enableNews: true
      }
      const story = {slug: "politics/awesome", seo: {"meta-google-news-standout": true}, tags: [{name: "Footag"}]}
      const string = getSeoMetadata(seoConfig, {"sketches-host": "http://foo.com"}, 'story-page', {data: {story: story}}, {url: url.parse("/my-page")})
      assertContains('<meta name="news_keywords" content="Footag"/>', string);
      assertContains('<link rel="standout" href="http://foo.com/politics/awesome"/>', string);
    });
  });

  describe("Getting the title", function() {
    it("can also get the title only", function() {
      const seo = new SEO({generators: []});
      const config = {"seo-metadata": [{"owner-type": "home", "data": {'page-title': "Foobar"}}]};
      assert.equal("Foobar", seo.getTitle(config, 'home-page', {}, {}));
    });

    it("can also get the title if passed in from data", function() {
      const seo = new SEO({generators: []});
      const config = {"seo-metadata": [{"owner-type": "home", "data": {'page-title': "Foobar"}}]};
      assert.equal("My Title", seo.getTitle(config, 'home-page', {title: "My Title"}, {}));
      assert.equal("My Title", seo.getTitle(config, 'home-page', {data: {title: "My Title"}}, {}));
    });
  });
});
