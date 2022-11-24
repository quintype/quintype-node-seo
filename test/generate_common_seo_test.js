const assert = require("assert");
const { generateStaticData, generateStructuredData } = require("..");

describe("Seo Helpers", function () {
  describe("Static Data Generator", function () {
    it("generates static data", function () {
      const config = {
        "public-integrations": {
          facebook: {
            "app-id": "4",
          },
        },
        "publisher-settings": {
          title: "abc",
        },
        "sketches-host": "abc.com",
        "publisher-name": "Abc",
        "theme-attributes": {
          twitter_app_name_ipad: "twitter-app-name-ipad",
          twitter_app_name_googleplay: "twitter-app-name-googleplay",
          twitter_app_id_googleplay: "twitter-app-id-googleplay",
          twitter_app_name_iphone: "twitter-app-name-iphone",
          twitter_app_id_iphone: "twitter-app-id-phone",
          apple_itunes_app: "apple-itunes-app",
          google_play_app: "google-play-app",
          fb_app_id: "fb-app-id",
          fb_pages: "fb-pages",
          logo: "https://quintype.com/abc.png",
        },
      };
      const expectedStaticData = {
        "twitter:site": "abc",
        "twitter:domain": "abc.com",
        "twitter:app:name:ipad": "twitter-app-name-ipad",
        "twitter:app:name:googleplay": "twitter-app-name-googleplay",
        "twitter:app:id:googleplay": "twitter-app-id-googleplay",
        "twitter:app:name:iphone": "twitter-app-name-iphone",
        "twitter:app:id:iphone": "twitter-app-id-phone",
        "apple-itunes-app": "apple-itunes-app",
        "google-play-app": "google-play-app",
        "fb:app_id": "4",
        "fb:pages": "fb-pages",
        "og:site_name": "abc",
      };
      const actualStaticData = generateStaticData(config);
      assert.deepEqual(actualStaticData, expectedStaticData);
    });

    it("does not crash when the config is empty", function () {
      const actualStaticData = generateStaticData({});
      assert.deepEqual(actualStaticData, {});
    });

    it("does not crash when theme attributes is null", function () {
      const config = {
        "publisher-settings": {
          title: "abc",
        },
        "sketches-host": "abc.com",
        "theme-attributes": null,
      };

      const expectedStaticData = {
        "twitter:site": "abc",
        "twitter:domain": "abc.com",
        "og:site_name": "abc",
      };

      const actualStaticData = generateStaticData(config);
      assert.deepEqual(actualStaticData, expectedStaticData);
    });

    it("fallback to publisher-name if title is empty", function () {
      const config = {
        "publisher-name": "Abc",
      };
      const expectedStaticData = {
        "twitter:site": "Abc",
        "og:site_name": "Abc",
      };

      const actualStaticData = generateStaticData(config);
      assert.deepEqual(actualStaticData, expectedStaticData);
    });
  });

  describe("Structured Data Generator", function () {
    it("generates structured data", function () {
      const config = {
        "publisher-settings": {
          title: "abc",
        },
        "publisher-name": "abc",
        "sketches-host": "abc.com",
        "theme-attributes": {
          logo: "https://quintype.com/abc.png?w=300&h=300",
        },
        "social-links": {
          "facebook-url": "https://www.facebook.com/abc/",
          "google-plus-url": "",
          "instagram-url": "https://www.instagram.com/abc",
          "twitter-url": "https://twitter.com/abc",
        },
        "seo-metadata": [
          {
            "owner-type": "home",
            data: {
              "page-title": "Abc",
              description: "News platform",
              keywords: "abc,news,quintype",
            },
          },
        ],
      };
      const expectedStructuredData = {
        organization: {
          name: "abc",
          url: "abc.com",
          logo: {
            "@context": "http://schema.org",
            "@type": "ImageObject",
            author: "abc",
            contentUrl: "https://quintype.com/abc.png?w=300&h=300",
            url: "https://quintype.com/abc.png?w=300&h=300",
            name: "logo",
            width: "300",
            height: "300",
          },
          sameAs: ["https://www.facebook.com/abc/", "", "https://www.instagram.com/abc", "https://twitter.com/abc"],
        },
        enableNewsArticle: false,
        storyUrlAsMainEntityUrl: false,
        enableVideo: true,
        enableLiveBlog: true,
        website: {
          url: "abc.com",
          searchpath: "search?q={query}",
          queryinput: "required name=query",
          name: "Abc",
          headline: "News platform",
          keywords: "abc,news,quintype",
        },
      };
      const actualStructuredData = generateStructuredData(config);
      assert.deepEqual(actualStructuredData, expectedStructuredData);
    });

    it("generate mainEntityStructured & NewsArticle data with theme-attributes", function () {
      const config = {
        "publisher-settings": {
          title: "abc",
        },
        "publisher-name": "abc",
        "sketches-host": "abc.com",
        "theme-attributes": {
          logo: "https://quintype.com/abc.png?w=300&h=300",
          structured_data_news_article: true,
        },
        "social-links": {
          "facebook-url": "https://www.facebook.com/abc/",
          "google-plus-url": "",
          "instagram-url": "https://www.instagram.com/abc",
          "twitter-url": "https://twitter.com/abc",
        },
        "seo-metadata": [
          {
            "owner-type": "home",
            data: {
              "page-title": "Abc",
              description: "News platform",
              keywords: "abc,news,quintype",
            },
          },
        ],
      };
      const expectedStructuredData = {
        organization: {
          name: "abc",
          url: "abc.com",
          logo: {
            "@context": "http://schema.org",
            "@type": "ImageObject",
            author: "abc",
            contentUrl: "https://quintype.com/abc.png?w=300&h=300",
            url: "https://quintype.com/abc.png?w=300&h=300",
            name: "logo",
            width: "300",
            height: "300",
          },
          sameAs: ["https://www.facebook.com/abc/", "", "https://www.instagram.com/abc", "https://twitter.com/abc"],
        },
        enableNewsArticle: true,
        storyUrlAsMainEntityUrl: true,
        enableVideo: true,
        enableLiveBlog: true,
        website: {
          url: "abc.com",
          searchpath: "search?q={query}",
          queryinput: "required name=query",
          name: "Abc",
          headline: "News platform",
          keywords: "abc,news,quintype",
        },
      };
      const actualStructuredData = generateStructuredData(config);
      assert.deepEqual(actualStructuredData, expectedStructuredData);
    });

    it("does not crash when the config is empty", function () {
      const expectedStructuredData = {};
      const actualStructuredData = generateStructuredData({});
      assert.deepEqual(actualStructuredData, expectedStructuredData);
    });

    it("does not crash when social links is null", function () {
      const config = {
        "publisher-settings": {
          title: "abc",
        },
        "sketches-host": "abc.com",
        "publisher-name": "Abc",
        "theme-attributes": {
          logo: "https://quintype.com/abc.png",
        },
        "social-links": null,
        "seo-metadata": [
          {
            "owner-type": "home",
            data: {
              "page-title": "Abc",
              description: "News platform",
              keywords: "abc,news,quintype",
            },
          },
        ],
      };

      const expectedStructuredData = {
        organization: {
          name: "abc",
          url: "abc.com",
          logo: {
            "@context": "http://schema.org",
            "@type": "ImageObject",
            author: "Abc",
            contentUrl: "https://quintype.com/abc.png",
            url: "https://quintype.com/abc.png",
            name: "logo",
            width: "",
            height: "",
          },
          sameAs: [],
        },
        storyUrlAsMainEntityUrl: false,
        enableNewsArticle: false,
        enableVideo: true,
        enableLiveBlog: true,
        website: {
          url: "abc.com",
          searchpath: "search?q={query}",
          queryinput: "required name=query",
          name: "Abc",
          headline: "News platform",
          keywords: "abc,news,quintype",
        },
      };

      const actualStructuredData = generateStructuredData(config);
      assert.deepEqual(actualStructuredData, expectedStructuredData);
    });

    it("does not crash when theme attributes is null", function () {
      const config = {
        "publisher-settings": {
          title: "abc",
        },
        "sketches-host": "abc.com",
        "publisher-name": "Abc",
        "theme-attributes": null,
        "social-links": {
          "facebook-url": "https://www.facebook.com/abc/",
          "google-plus-url": "",
          "instagram-url": "https://www.instagram.com/abc",
          "twitter-url": "https://twitter.com/abc",
        },
        "seo-metadata": [
          {
            "owner-type": "home",
            data: {
              "page-title": "Abc",
              description: "News platform",
              keywords: "abc,news,quintype",
            },
          },
        ],
      };
      const actualStructuredData = generateStructuredData(config);
      assert.deepEqual(actualStructuredData, {});
    });

    it("takes the site twitter handle for twitter:site if present", function () {
      const config = {
        "publisher-settings": {
          title: "abc",
        },
        "sketches-host": "abc.com",
        "publisher-name": "Abc",
        "theme-attributes": null,
        "social-links": {
          "twitter-url": "https://twitter.com/abc",
        },
        "seo-metadata": [
          {
            "owner-type": "home",
            data: {
              "page-title": "Abc",
              description: "News platform",
              keywords: "abc,news,quintype",
            },
          },
        ],
      };
      const actualStaticData = generateStaticData(config);
      assert.strictEqual(actualStaticData["twitter:site"], "@abc");
    });

    it("takes the title for twitter:site site twitter handle not present", function () {
      const config = {
        "publisher-settings": {
          title: "this is the site title",
        },
        "sketches-host": "abc.com",
        "publisher-name": "Abc",
        "theme-attributes": null,
        "seo-metadata": [
          {
            "owner-type": "home",
            data: {
              "page-title": "Abc",
              description: "News platform",
              keywords: "abc,news,quintype",
            },
          },
        ],
      };
      const actualStaticData = generateStaticData(config);
      assert.strictEqual(actualStaticData["twitter:site"], "this is the site title");
    });
  });
});
