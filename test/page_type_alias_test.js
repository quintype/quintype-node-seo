const {TextTags} = require("..");
const {getSeoMetadata, assertContains} = require("./utils");

const assert = require('assert');
const url = require("url");

describe('pageTypeAliases', function() {
  it('uses the pagetype alias', function() {
    const seoConfig = {
      generators: [TextTags],
      pageTypeAliases: {
        "awesome-page": "section-page"
      }
    }
    const config = {"seo-metadata": [{"owner-type": 'section', 'owner-id': 42, data: {'page-title': "Foobar"}}]};
    const string = getSeoMetadata(seoConfig, config, 'awesome-page', {data: {section: {id: 42}}}, {url: url.parse("/")})
    assertContains('<title>Foobar</title>', string);
  });
});
