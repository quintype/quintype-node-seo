const {StructuredDataTags} = require("..");
const {getSeoMetadata, assertContains} = require("./utils");

const assert = require('assert');
const url = require("url");

const organization = {
  name: "Quintype",
  url: "http://www.quintype.com/",
  logo: "https://quintype.com/logo.png",
  sameAs: [
  "https://www.facebook.com/quintype",
  "https://twitter.com/quintype_inc",
  "https://plus.google.com/+quintype",
  "https://www.youtube.com/user/Quintype"
  ]
}

const website = {
  url: "https://madrid.quintype.io",
  searchpath: "search?q={query}",
  queryinput: "required name=query"
}

function getSeoConfig({newsArticle = false, liveBlog = false, video = false} = {}) {
  return {
    generators: [StructuredDataTags],
    structuredData: {
      organization,
      website,
      "enableNewsArticle": newsArticle,
      "enableLiveBlog": liveBlog,
      "enableVideo": video
    }
  }
}

function sampleAuthorsData() {
  return [
    {
      "id": 482995,
      "name": "Greeshma",
      "slug": "greeshma",
      "avatar-url": "https://images.assettype.com/quintype-demo/2018-03/9a16b150-6281-45e6-bdb9-6eb1146e1a54/50b1da06-b478-4bc8-8067-fada337c55d0.jpeg",
      "avatar-s3-key": "quintype-demo/2018-03/9a16b150-6281-45e6-bdb9-6eb1146e1a54/50b1da06-b478-4bc8-8067-fada337c55d0.jpeg",
      "twitter-handle": null,
      "bio": null
    }
  ];
}

function sampleStoryData(template, cards, authors) {
  return {
    data : {
      story: {
        "story-template": template,
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
        "cards": cards,
        "content-updated-at": 1524204468980,
        "first-published-at": 1519816264773,
        "created-at": 1524204200588,
        "updated-at": 1524204200588,
        "authors": authors,
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
    }
  };
}

const sampleOrganisationTag = '<script type="application/ld+json">{"name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"@type":"Organization","@context":"http://schema.org"}</script>';
const sampleWebsiteTag = '<script type="application/ld+json">{"@context":"http://schema.org","@type":"Website","url":"https://madrid.quintype.io","potentialAction":{"@type":"SearchAction","target":"https://madrid.quintype.io/search?q={query}","query-input":"required name=query"}}</script>'

describe('StructuredDataTags', function() {
  it("puts the organization & website tag", function() {
    const string = getSeoMetadata(getSeoConfig({}), {}, 'home-page', {}, {url: url.parse("/")});
    assertContains(sampleOrganisationTag + sampleWebsiteTag, string);
  });

  describe('with news article data ', function() {
    it("puts the news article when enableNewsArticle truthy in theme-attributes config", function() {
      const string = getSeoMetadata(getSeoConfig({newsArticle: true}), {}, 'story-page', sampleStoryData(null, [], sampleAuthorsData()), {url: url.parse("/")});
      assertContains(sampleOrganisationTag + '<script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-04-20T06:03:25.102Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>', string);
    });
  });

  describe('without news article data ', function() {
    it("puts only the article tag when enableNewsArticle false in theme-attributes config", function() {
      const string = getSeoMetadata(getSeoConfig({newsArticle: false}), {}, 'story-page', sampleStoryData(null, [], sampleAuthorsData()), {url: url.parse("/")});
      assertContains(sampleOrganisationTag + '<script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-04-20T06:03:25.102Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","@type":"Article","@context":"http://schema.org"}</script>', string);
    });
  });

  describe('with authors value null in article data', function() {
    it("should fallback to the given author-name", function() {
      const string = getSeoMetadata(getSeoConfig({}), {}, 'story-page', sampleStoryData(null, [], null));
      assertContains(sampleOrganisationTag + '<script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-04-20T06:03:25.102Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","@type":"Article","@context":"http://schema.org"}</script>', string);
    });
  });

  describe('with authors value an empty array in article data', function() {
    it("should fallback to the given author-name", function() {
      const string = getSeoMetadata(getSeoConfig({}), {}, 'story-page', sampleStoryData(null, [], []));
      assertContains(sampleOrganisationTag + '<script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-04-20T06:03:25.102Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","@type":"Article","@context":"http://schema.org"}</script>', string);
    });
  });

  describe('with given authors array in article data', function() {
    it("should read from the authors array", function() {
      const string = getSeoMetadata(getSeoConfig({}), {}, 'story-page', sampleStoryData(null, [], sampleAuthorsData()));
      assertContains(sampleOrganisationTag + '<script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-04-20T06:03:25.102Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","@type":"Article","@context":"http://schema.org"}</script>', string);
    });
  });

  describe('with video object', function() {
    it("should give the type of video object", function() {
      const string = getSeoMetadata(getSeoConfig({video: true}), {}, 'story-page', sampleStoryData('video', [], sampleAuthorsData()));
      assertContains(sampleOrganisationTag + '<script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-04-20T06:03:25.102Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"uploadDate":"2018-04-20T06:03:25.102Z","@type":"VideoObject","@context":"http://schema.org"}</script>', string);
    });
  });

  describe('with live blog data', function() {
    it("puts the news article when enableNewsArticle truthy in theme-attributes config", function() {
      const cards = [{
        "card-added-at": 1519816264773,
        "card-updated-at": 1524204205102,
        "story-elements": [{
          "type": "title",
          "text": "BQ Live: Hot Money"
        }, {
          "type": "jsembed",
          "metadata": {
            "vidible-video-id": "59bb646192fdde488f02624e"
          },
          "subtype": "vidible-video"
        }, {
          "image-s3-key": "bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG",
          "type": "image",
        }]
      }]
      const string = getSeoMetadata(getSeoConfig({newsArticle: true, liveBlog: true}), {}, 'story-page', sampleStoryData('live-blog', cards, sampleAuthorsData()), {url: url.parse("/")});
      assertContains(sampleOrganisationTag + '<script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-04-20T06:03:25.102Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","coverageEndTime":"2018-04-20T06:03:25.102Z","coverageStartTime":"2018-04-20T06:03:20.588Z","liveBlogUpdate":[{"@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"dateModified":"2018-04-20T06:03:25.102Z","dateCreated":"2018-02-28T11:11:04.773Z","datePublished":"2018-04-20T06:03:25.102Z","author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"headline":"BQ Live: Hot Money","image":"https://images.assettype.com/bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG?w=480&auto=format%2Ccompress&fit=max"}],"@type":"LiveBlogPosting","@context":"http://schema.org"}</script>', string);
    });

    it("uses default story headline if the card has no title", function() {
      const cards = [{
        "card-added-at": 1519816264773,
        "card-updated-at": 1524204205102,
        "story-elements": []
      }];
      const string = getSeoMetadata(getSeoConfig({newsArticle: true, liveBlog: true}), {}, 'story-page', sampleStoryData('live-blog', cards, sampleAuthorsData()), {url: url.parse("/")});
      assertContains(sampleOrganisationTag + '<script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-04-20T06:03:25.102Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":[],"dateCreated":"2018-04-20T06:03:20.588Z","dateModified":"2018-04-20T06:03:20.588Z","coverageEndTime":"2018-04-20T06:03:25.102Z","coverageStartTime":"2018-04-20T06:03:20.588Z","liveBlogUpdate":[{"@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]},"dateModified":"2018-04-20T06:03:25.102Z","dateCreated":"2018-02-28T11:11:04.773Z","datePublished":"2018-04-20T06:03:25.102Z","author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"headline":"Personalise or perish - Why publishers need to use personalised content","image":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&auto=format%2Ccompress&fit=max"}],"@type":"LiveBlogPosting","@context":"http://schema.org"}</script>', string);
    });
  });
});