const {StructuredDataTags} = require("..");
const {getSeoMetadata, assertContains} = require("./utils");

const assert = require('assert');
const url = require("url");

describe('StructuredDataTags', function() {
  describe('On all pages', function() {
    it("puts the organization tag", function() {
      const seoConfig = {
        generators: [StructuredDataTags],
        structuredData: {
          organization: {
            name: "Quintype",
            url: "http://www.quintype.com/",
            logo: "https://quintype.com/logo.png",
            sameAs: ["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]
          }
        },
        "enableNewsArticle": false
      };
      const string = getSeoMetadata(seoConfig, {}, 'home-page', {}, {url: url.parse("/")});
      assertContains('<script type="application/ld+json">{"name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"@type":"Organization","@context":"http://schema.org"}</script>', string);
    });
  });
});


describe('StructuredDataTags with news article data ', function() {
  describe('On all pages', function() {
    it("puts the news article when structured_data_news_article is truthy in theme-attributes config", function() {
      const seoConfig = {
        generators: [StructuredDataTags],
        structuredData: {
          organization: {
            name: "Quintype",
            url: "http://www.quintype.com/",
            logo: "https://quintype.com/logo.png",
            sameAs: ["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]
          },
          enableNewsArticle: true
        }
      };

      const data = {
        data : {
          story: {
            "seo": {
              "meta-description": "",
              "meta-title": " Why publishers need to use personalised content",
              "meta-keywords": [],
              "meta-google-news-standout": false,
              "claim-reviews": {
                "story": null
              }
            },
            "author-name": "Greeshma",
            "tags": [],
            "headline": "Personalise or perish - Why publishers need to use personalised content",
            "slug": "politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content",
            "last-published-at": 1524204205102,
            "alternative": {
              "home": {
                "default": {
                  "headline": "Personalise or perish"
                }
              }
            },
            "content-created-at": 1519814417485,
            "owner-name": "Greeshma",
            "hero-image-metadata": {
              "width": 1920,
              "height": 1280,
              "mime-type": "image/jpeg",
              "focus-point": [
                931,
                901
              ]
            },
            "published-at": 1524204205102,
            "summary": "Personalised content marketing is the slayer weapon in this war for attention and engagement.",
            "hero-image-s3-key": "quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg",
            "cards": [],
            "content-updated-at": 1524204468980,
            "first-published-at": 1519816264773,
            "created-at": 1524204200588,
            "updated-at": 1524204200588,
            "authors": [
              {
                "id": 482995,
                "name": "Greeshma",
                "slug": "greeshma",
                "avatar-url": "https://images.assettype.com/quintype-demo/2018-03/9a16b150-6281-45e6-bdb9-6eb1146e1a54/50b1da06-b478-4bc8-8067-fada337c55d0.jpeg",
                "avatar-s3-key": "quintype-demo/2018-03/9a16b150-6281-45e6-bdb9-6eb1146e1a54/50b1da06-b478-4bc8-8067-fada337c55d0.jpeg",
                "twitter-handle": null,
                "bio": null
              }
            ],
            "metadata": {
              "card-share": {
                "shareable": true
              }
            },
            "publish-at": null,
          },
        },
        config: {
          "cdn-image": "images.assettype.com",
          "sketches-host": "https://madrid.quintype.io",
          "publisher-name": "quintype-demo",
          "publisher-settings": {
            "title": "Quintype Demo",
            "copyright": "© quintype-demo 2018"
          },
          "social-links": {
            "facebook-url": "https://www.facebook.com/quintypeinc",
            "twitter-url": "https://twitter.com/quintype_inc"
          },
          "theme-attributes": {
            "structured_data_news_article": true
          }
        }
      };

      const string = getSeoMetadata(seoConfig, {}, 'story-page', data, {url: url.parse("/")});
      assertContains('<script type="application/ld+json">{"name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"@type":"Organization","@context":"http://schema.org"}</script><script type="application/ld+json">{"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","headline":"Personalise or perish - Why publishers need to use personalised content","alternativeHeadline":"","image":["images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"datePublished":"2018-04-20T06:03:25.102Z","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org","publisher":{"name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]}}</script>', string);
    });
  });
});



describe('StructuredDataTags without news article data ', function() {
  describe('On all story pages', function() {
    it("puts only the article tag when structured_data_news_article is false in theme-attributes config", function() {
      const seoConfig = {
        generators: [StructuredDataTags],
        structuredData: {
          organization: {
            name: "Quintype",
            url: "http://www.quintype.com/",
            logo: "https://quintype.com/logo.png",
            sameAs: ["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]
          },
          enableNewsArticle: false
        }
      };

      const data = {
        data : {
          story: {
            "seo": {
              "meta-description": "",
              "meta-title": " Why publishers need to use personalised content",
              "meta-keywords": [],
              "meta-google-news-standout": false,
              "claim-reviews": {
                "story": null
              }
            },
            "author-name": "Greeshma",
            "tags": [],
            "headline": "Personalise or perish - Why publishers need to use personalised content",
            "slug": "politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content",
            "last-published-at": 1524204205102,
            "alternative": {
              "home": {
                "default": {
                  "headline": "Personalise or perish"
                }
              }
            },
            "content-created-at": 1519814417485,
            "owner-name": "Greeshma",
            "hero-image-metadata": {
              "width": 1920,
              "height": 1280,
              "mime-type": "image/jpeg",
              "focus-point": [
                931,
                901
              ]
            },
            "published-at": 1524204205102,
            "summary": "Personalised content marketing is the slayer weapon in this war for attention and engagement.",
            "hero-image-s3-key": "quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg",
            "cards": [],
            "content-updated-at": 1524204468980,
            "first-published-at": 1519816264773,
            "created-at": 1524204200588,
            "updated-at": 1524204200588,
            "authors": [
              {
                "id": 482995,
                "name": "Greeshma",
                "slug": "greeshma",
                "avatar-url": "https://images.assettype.com/quintype-demo/2018-03/9a16b150-6281-45e6-bdb9-6eb1146e1a54/50b1da06-b478-4bc8-8067-fada337c55d0.jpeg",
                "avatar-s3-key": "quintype-demo/2018-03/9a16b150-6281-45e6-bdb9-6eb1146e1a54/50b1da06-b478-4bc8-8067-fada337c55d0.jpeg",
                "twitter-handle": null,
                "bio": null
              }
            ],
            "metadata": {
              "card-share": {
                "shareable": true
              }
            },
            "publish-at": null,
          },
        },
        config: {
          "cdn-image": "images.assettype.com",
          "sketches-host": "https://madrid.quintype.io",
          "publisher-name": "quintype-demo",
          "publisher-settings": {
            "title": "Quintype Demo",
            "copyright": "© quintype-demo 2018"
          },
          "social-links": {
            "facebook-url": "https://www.facebook.com/quintypeinc",
            "twitter-url": "https://twitter.com/quintype_inc"
          },
          "theme-attributes": {
            "logo": "",
            "primary_color": "#000",
            "secondary_color": "",
            "structured_data_news_article": false
          }
        }
      };

      const string = getSeoMetadata(seoConfig, {}, 'story-page', data, {url: url.parse("/")});
      assertContains('<script type="application/ld+json">{"name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"@type":"Organization","@context":"http://schema.org"}</script><script type="application/ld+json">{"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","@type":"Article","@context":"http://schema.org"}</script>', string);
    });
  });
});