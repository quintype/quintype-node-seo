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
        }
      }
      const string = getSeoMetadata(seoConfig, {}, 'home-page', {}, {url: url.parse("/")})
      assertContains('<script type="application/ld+json">{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]}</script>', string);
    }  );
  });
});
