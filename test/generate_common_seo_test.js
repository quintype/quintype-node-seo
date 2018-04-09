const assert = require("assert");
const {generateStaticData, generateStructuredData} = require("..");

describe('Seo Helpers', function() {
  const config = {
    "publisher-settings": {
      "title": "abc"
    },
    "sketches-host": "abc.com",
    "publisher-name": "Abc",
    "theme-attributes": {
      "twitter-app-name-ipad": "",
      "twitter-app-name-googleplay": "",
      "twitter-app-id-googleplay": "",
      "twitter-app-name-iphone": "",
      "twitter-app-id-iphone": "",
      "apple-itunes-app": "",
      "google-play-app": "",
      "fb-app-id": "",
      "fb-pages": "",
      "logo": "https://quintype.com/abc.png"
    },
    "social-links": {
      "facebook-url": "https://www.facebook.com/abc/",
      "google-plus-url": "",
      "instagram-url": "https://www.instagram.com/abc",
      "twitter-url": "https://twitter.com/abc"
    }
  }

  describe('Static Data Generator', function() {
    it('generates static data', function() {
      const expectedStaticData = {
        "twitter:site": "abc",
        "twitter:domain": "abc.com",
        "twitter:app:name:ipad": "",
        "twitter:app:name:googleplay": "",
        "twitter:app:id:googleplay": "",
        "twitter:app:name:iphone": "",
        "twitter:app:id:iphone": "",
        "apple-itunes-app": "",
        "google-play-app": "",
        "fb:app_id": "",
        "fb:pages": "",
        "og:site_name": "abc"
      }
      const actualStaticData = generateStaticData(config)
      assert.deepEqual(actualStaticData, expectedStaticData)
    })
  
    it('does not crash when the config is empty', function() {
      const actualStaticData = generateStaticData({})
      assert.deepEqual(actualStaticData, {})
    })
  
    it('does not crash when theme attributes is null', function() {
      const config = {
        "publisher-settings": {
          "title": "abc"
        },
        "sketches-host": "abc.com",
        "theme-attributes": null,
      }
  
      const expectedStaticData = {
        "twitter:site": "abc",
        "twitter:domain": "abc.com",
        "og:site_name": "abc"
      }
  
      const actualStaticData = generateStaticData(config)
      assert.deepEqual(actualStaticData, expectedStaticData)
    })
  
    it('fallback to publisher-name if title is empty', function() {
      const config = {
        "publisher-name": "Abc",
      }
      const expectedStaticData = {
        "twitter:site": "Abc",
        "og:site_name": "Abc"
      }
  
      const actualStaticData = generateStaticData(config)
      assert.deepEqual(actualStaticData, expectedStaticData)
    })
  })

  describe('Structured Data Generator', function() {
    it('generates structured data', function() {
      const expectedStructuredData = {
        organization: {
          name: "abc",
          url: "abc.com",
          logo: "https://quintype.com/abc.png",
          sameAs: ["https://www.facebook.com/abc/", "", "https://www.instagram.com/abc", "https://twitter.com/abc"]
        }
      }
      const actualStructuredData = generateStructuredData(config)
      assert.deepEqual(actualStructuredData, expectedStructuredData)
    })
  
    it('does not crash when the config is empty', function() {
      const expectedStructuredData = {
        organization: {
          name: undefined,
          url: undefined,
          logo: "https://quintype.com/logo.png",
          sameAs: []
        }
      }
      const actualStructuredData = generateStructuredData({})
      assert.deepEqual(actualStructuredData, expectedStructuredData)
    })
  
    it('does not crash when social links is null', function() {
      const config = {
        "publisher-settings": {
          "title": "abc"
        },
        "sketches-host": "abc.com",
        "publisher-name": "Abc",
        "theme-attributes": {
          "logo": "https://quintype.com/abc.png"
        },
        "social-links": null
      }
  
      const expectedStructuredData = {
        organization: {
          name: "abc",
          url: "abc.com",
          logo: "https://quintype.com/abc.png",
          sameAs: []
        }
      }
  
      const actualStructuredData = generateStructuredData(config)
      assert.deepEqual(actualStructuredData, expectedStructuredData)
    })
  
    it('does not crash when theme attributes is null', function() {
      const config = {
        "publisher-settings": {
          "title": "abc"
        },
        "sketches-host": "abc.com",
        "publisher-name": "Abc",
        "theme-attributes": null,
        "social-links": {
          "facebook-url": "https://www.facebook.com/abc/",
          "google-plus-url": "",
          "instagram-url": "https://www.instagram.com/abc",
          "twitter-url": "https://twitter.com/abc"
        }
      }
  
      const expectedStructuredData = {
        organization: {
          name: "abc",
          url: "abc.com",
          logo: "https://quintype.com/logo.png",
          sameAs: ["https://www.facebook.com/abc/", "", "https://www.instagram.com/abc", "https://twitter.com/abc"]
        }
      }
  
      const actualStructuredData = generateStructuredData(config)
      assert.deepEqual(actualStructuredData, expectedStructuredData)
    })
  })
})