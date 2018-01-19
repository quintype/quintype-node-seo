const {ImageTags} = require("..");
const {getSeoMetadata, assertContains} = require("./utils");

const assert = require('assert');

describe('ImageTags', function() {
  const seoConfig = {
    generators: [ImageTags],
    enableOgTags: true,
    enableTwitterCards: true
  }

  const config = {
    "cdn-image": "thumbor.assettype.com"
  }

  it("gets the twitter tags", function() {
    const story = {"hero-image-s3-key": "my/image.png"}
    const string = getSeoMetadata(seoConfig, config, 'story-page', {data: {story: story}}, {})
    assertContains('<meta name="twitter:image" content="https://thumbor.assettype.com/my%2Fimage.png?w=1200&amp;auto=format%2Ccompress"/>', string);
  });

  it("has facebook tags resized correctly", function() {
    const story = {"hero-image-s3-key": "my/image.png", "hero-image-metadata": {width: 2400, height: 1260, "focus-point": [0, 0]}}
    const string = getSeoMetadata(seoConfig, config, 'story-page', {data: {story: story}}, {})
    assertContains('<meta property="og:image" content="https://thumbor.assettype.com/my%2Fimage.png?rect=0%2C0%2C2400%2C1260&amp;w=1200&amp;auto=format%2Ccompress"/>', string);
    assertContains('<meta property="og:image:width" content="1200"/>', string);
    assertContains('<meta property="og:image:height" content="630"/>', string);
  })
});
