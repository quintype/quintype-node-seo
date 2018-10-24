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

    it('generates tags for custom static pages', function() {
      const seoConfig = {
        generators: [TextTags],
        customTags:{
          'services-page' : {
            title: "services-page-title",
            "page-title": "services-page-title",
            description: "services-page-desc",
            keywords: ['services-page1','services-page2']
          }
        }
      };
      const config = {"seo-metadata": [{"owner-type": "home", "data": {'page-title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'services-page', {}, {url: url.parse("/")})
      assertContains('<title>services-page-title</title>', string);
      assertContains('<meta name="description" content="services-page-desc"/>', string);
      assertContains('<meta name="title" content="services-page-title"/>', string);
      assertContains('<meta name="keywords" content="services-page1,services-page2"/>', string);
    });

    it("gets the meta config for the section when section metadata is available", function() {
      const seoConfig = {
        generators: [TextTags],
      };
      const data = {
        'page-title': "Quintype Demo Homepage",
        title: "Quintype Demo Homepage Meta",
        description: "This is a demo page for Quintype",
        keywords: "quintype, demo"
      };
      const config = {"seo-metadata": [{"owner-type": 'section', 'owner-id': 42, data}]};
      const string = getSeoMetadata(seoConfig, config, 'section-page', {data: {section: {id: 42}}}, {url: url.parse("/")});
      assertContains('<title>Quintype Demo Homepage</title>', string);
      assertContains('<meta name="description" content="This is a demo page for Quintype"/>', string);
      assertContains('<meta name="title" content="Quintype Demo Homepage Meta"/>', string);
      assertContains('<meta name="keywords" content="quintype, demo"/>', string);
    });

    it("fallback to homepage description when description attribute in section metadata is unavailable", function() {
      const seoConfig = {
        generators: [TextTags],
      };
      const data = {
        'page-title': "Quintype Demo Homepage",
        title: "Quintype Demo Homepage Meta",
        keywords: "quintype, demo"
      };
      const config = {
        "seo-metadata": [
          {"owner-type": 'section', 'owner-id': 42, data},
          {"owner-type": 'home', 'owner-id': 42, data : { 'description': 'home description'} }
        ]
      };
      const string = getSeoMetadata(seoConfig, config, 'section-page', {data: {section: {id: 42}}}, {url: url.parse("/")});
      assertContains('<title>Quintype Demo Homepage</title>', string);
      assertContains('<meta name="description" content="home description"/>', string);
      assertContains('<meta name="title" content="Quintype Demo Homepage Meta"/>', string);
      assertContains('<meta name="keywords" content="quintype, demo"/>', string);
    });

    it("fallback to section name when title attribute in section metadata is unavailable", function() {
      const seoConfig = {
        generators: [TextTags],
      };
      const data = {
        'page-title': "Quintype Demo Homepage",
        'description': "Section Description",
        'keywords': "quintype, demo"
      };
      const config = {
        "sections": [
          {
          "id": 42,
          "name": "Current Affairs",
          }
        ],
        "seo-metadata": [
          {"owner-type": 'section', 'owner-id': 42, data},
        ]
      };
      const string = getSeoMetadata(seoConfig, config, 'section-page', {data: {section: {id: 42}}}, {url: url.parse("/")});
      assertContains('<title>Quintype Demo Homepage</title>', string);
      assertContains('<meta name="description" content="Section Description"/>', string);
      assertContains('<meta name="title" content="Current Affairs"/>', string);
      assertContains('<meta name="keywords" content="quintype, demo"/>', string);
    });

    it("fallback to section name when page-title attribute in section metadata is unavailable", function() {
      const seoConfig = {
        generators: [TextTags],
      };
      const data = {
        'title': "Quintype Demo",
        'description': "Section Description",
        'keywords': "quintype, demo"
      };
      const config = {
        "sections": [
          {
          "id": 42,
          "name": "Current Affairs",
          }
        ],
        "seo-metadata": [
          {"owner-type": 'section', 'owner-id': 42, data},
        ]
      };
      const string = getSeoMetadata(seoConfig, config, 'section-page', {data: {section: {id: 42}}}, {url: url.parse("/")});
      assertContains('<title>Current Affairs</title>', string);
      assertContains('<meta name="description" content="Section Description"/>', string);
      assertContains('<meta name="title" content="Quintype Demo"/>', string);
      assertContains('<meta name="keywords" content="quintype, demo"/>', string);
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

    it("Also generates all other fields", function() {
      const seoConfig = {
        generators: [TextTags],
        enableOgTags: true,
        enableTwitterCards: true
      };
      const config = {"sketches-host": "http://foo.com", "seo-metadata": [{"owner-type": "home", "data": {'title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'home-page', {}, {url: url.parse("/")})
      assertContains('<meta name="title" content="Foobar"/>', string);
      assertContains('<meta name="twitter:title" content="Foobar"/>', string);
      assertContains('<meta property="og:title" content="Foobar"/>', string);
      assertContains('<link rel="canonical" href="http://foo.com/"/>', string);
    });

    it("twitter title will be headline if its a story page", function() {
      const seoConfig = {
        generators: [TextTags],
        enableOgTags: true,
        enableTwitterCards: true
      };
      const config = {"sketches-host": "http://foo.com", "seo-metadata": [{"owner-type": "home", "data": {'title': "Foobar"}}]};
      const string = getSeoMetadata(seoConfig, config, 'story-page', {data:{story:{slug:'story-slug',headline:'story-headline'}}}, {url: url.parse("/")})
      assertContains('<meta name="title" content="story-headline"/>', string);
      assertContains('<meta name="twitter:title" content="story-headline"/>', string);
      assertContains('<meta property="og:title" content="story-headline"/>', string);
      assertContains('<link rel="canonical" href="http://foo.com/story-slug"/>', string);
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
