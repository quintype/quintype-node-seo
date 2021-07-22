const { ImageTags } = require("..");
const { getSeoMetadata, assertContains } = require("./utils");

const assert = require("assert");

describe("ImageTags", function() {
  const seoConfig = {
    generators: [ImageTags],
    enableOgTags: true,
    enableTwitterCards: true
  };

  const config = {
    "cdn-image": "thumbor.assettype.com"
  };

  it("gets the twitter tags", function() {
    const story = {
      "hero-image-s3-key": "my/image.png",
      alternative: {
        social: {
          default: {
            headline: null,
            "hero-image": {
              "hero-image-s3-key": "my/socialimage.png"
            }
          }
        },
        home: {
          default: {
            headline: null,
            "hero-image": {
              "hero-image-s3-key": "my/homeimage.png"
            }
          }
        }
      }
    };
    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      {}
    );
    const ampPageString = getSeoMetadata(
      seoConfig,
      config,
      "story-page-amp",
      { data: { story: story } },
      {}
    );
    assertContains(
      '<meta name="twitter:image" content="https://thumbor.assettype.com/my%2Fsocialimage.png?w=1200&amp;auto=format%2Ccompress&amp;ogImage=true"/>',
      string
    );
    assertContains(
      '<meta name="twitter:image" content="https://thumbor.assettype.com/my%2Fsocialimage.png?w=1200&amp;auto=format%2Ccompress&amp;ogImage=true"/>',
      ampPageString
    );
  });

  it("has facebook tags resized correctly", function() {
    const story = {
      "hero-image-s3-key": "my/images.png",
      "hero-image-metadata": {
        width: 2400,
        height: 1260,
        "focus-point": [0, 0]
      },
      alternative: {
        social: {
          default: {
            headline: null,
            "hero-image": {
              "hero-image-metadata": {
                width: 2400,
                height: 1260,
                "focus-point": [0, 0]
              },
              "hero-image-s3-key": "my/socialimage.png"
            }
          }
        },
        home: {
          default: {
            headline: null,
            "hero-image": {
              "hero-image-metadata": {
                width: 2400,
                height: 1260,
                "focus-point": [0, 0]
              },
              "hero-image-s3-key": "my/homeimage.png"
            }
          }
        }
      }
    };
    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      {}
    );
    const ampPageString = getSeoMetadata(
      seoConfig,
      config,
      "story-page-amp",
      { data: { story: story } },
      {}
    );
    assertContains(
      '<meta property="og:image" content="https://thumbor.assettype.com/my%2Fsocialimage.png?rect=0%2C0%2C2400%2C1260&amp;w=1200&amp;auto=format%2Ccompress&amp;ogImage=true"/>',
      string
    );
    assertContains(
      '<meta property="og:image" content="https://thumbor.assettype.com/my%2Fsocialimage.png?rect=0%2C0%2C2400%2C1260&amp;w=1200&amp;auto=format%2Ccompress&amp;ogImage=true"/>',
      ampPageString
    );
    assertContains('<meta property="og:image:width" content="1200"/>', string);
    assertContains('<meta property="og:image:height" content="630"/>', string);
    assertContains('<meta property="og:image:width" content="1200"/>', ampPageString);
    assertContains('<meta property="og:image:height" content="630"/>', ampPageString);
  });

  it("gets card image values instead of story image values on card share", function() {
    const story = {
      "hero-image-s3-key": "my/image.png",
      cards: [
        {
          id: "sample-card-id",
          metadata: {
            "social-share": {
              title: "share-card-title",
              message: "share-card-description",
              image: {
                key: "my/card/image.jpg",
                metadata: {
                  width: 1300,
                  height: 1065,
                  "mime-type": "image/jpeg"
                }
              }
            }
          }
        }
      ]
    };

    const opts = {
      url: {
        query: {
          cardId: "sample-card-id"
        }
      }
    };

    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      opts
    );

    assertContains(
      '<meta name="twitter:image" content="https://thumbor.assettype.com/my%2Fcard%2Fimage.jpg?w=1200&amp;auto=format%2Ccompress&amp;ogImage=true"/>',
      string
    );
  });

  it("gets story hero image attribution values instead of card attribution values on story share", function() {
    const story = {
      "hero-image-s3-key": "my/image.png",
      "hero-image-attribution": "attribution test",
      cards: [
        {
          id: "sample-card-id",
          metadata: {
            "social-share": {
              title: "share-card-title",
              message: "share-card-description",
              image: {
                key: "my/card/image.jpg",
                attribution: null,
                metadata: {
                  width: 1300,
                  height: 1065,
                  "mime-type": "image/jpeg"
                }
              }
            }
          }
        }
      ]
    };

    const opts = {
      url: {
        query: {
          cardId: "sample-card-id"
        }
      }
    };

    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      opts
    );

    assertContains('<meta property="twitter:image:alt" content="attribution test"/>', string)

    assertContains('<meta property="og:image:alt" content="attribution test"/>', string)

  });

  it("gets story summary as attribution if hero image attribution is not present", function() {
    const story = {
      "hero-image-s3-key": "my/image.png",
      "hero-image-attribution": null,
      summary: "attribution test",
      cards: [
        {
          id: "sample-card-id",
          metadata: {
            "social-share": {
              title: "share-card-title",
              message: "share-card-description",
              image: {
                key: "my/card/image.jpg",
                metadata: {
                  width: 1300,
                  height: 1065,
                  "mime-type": "image/jpeg"
                }
              }
            }
          }
        }
      ]
    };

    const opts = {
      url: {
        query: {
          cardId: "sample-card-id"
        }
      }
    };

    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      opts
    );

    assertContains('<meta property="twitter:image:alt" content="attribution test"/>', string)

    assertContains('<meta property="og:image:alt" content="attribution test"/>', string)

  });

  it("gets story headline as attribution if hero image attribution and summary is not present", function() {
    const story = {
      "hero-image-s3-key": "my/image.png",
      "hero-image-attribution": null,
      summary: null,
      headline: "attribution test",
      cards: [
        {
          id: "sample-card-id",
          metadata: {
            "social-share": {
              title: "share-card-title",
              message: "share-card-description",
              image: {
                key: "my/card/image.jpg",
                metadata: {
                  width: 1300,
                  height: 1065,
                  "mime-type": "image/jpeg"
                }
              }
            }
          }
        }
      ]
    };

    const opts = {
      url: {
        query: {
          cardId: "sample-card-id"
        }
      }
    };

    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      opts
    );

    assertContains('<meta property="twitter:image:alt" content="attribution test"/>', string)

    assertContains('<meta property="og:image:alt" content="attribution test"/>', string)

  });

  it("gets card image attribution values instead of story attribution values on card share", function() {
    const story = {
      "hero-image-s3-key": "my/image.png",
      headline: "story headline",
      cards: [
        {
          id: "sample-card-id",
          metadata: {
            "social-share": {
              title: "share-card-title",
              message: "share-card-description",
              image: {
                attribution: "attribution test",
                key: "my/card/image.jpg",
                metadata: {
                  width: 1300,
                  height: 1065,
                  "mime-type": "image/jpeg"
                }
              }
            }
          }
        }
      ]
    };

    const opts = {
      url: {
        query: {
          cardId: "sample-card-id"
        }
      }
    };

    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      opts
    );

    assertContains('<meta property="twitter:image:alt" content="attribution test"/>', string)

    assertContains('<meta property="og:image:alt" content="attribution test"/>', string)

  });

  it("gets story data as fallback if the card metadata is falsy", function() {
    const story = {
      "hero-image-s3-key": "my/image.png",
      cards: [
        {
          id: "sample-card-id",
          metadata: {
            "social-share": {
              title: "share-card-title",
              message: "share-card-description"
            }
          }
        }
      ]
    };

    const opts = {
      url: {
        query: {
          cardId: "sample-card-id"
        }
      }
    };

    const string = getSeoMetadata(
      seoConfig,
      config,
      "story-page",
      { data: { story: story } },
      opts
    );
    const ampPageString = getSeoMetadata(
      seoConfig,
      config,
      "story-page-amp",
      { data: { story: story } },
      opts
    );

    assertContains(
      '<meta name="twitter:image" content="https://thumbor.assettype.com/my%2Fimage.png?w=1200&amp;auto=format%2Ccompress&amp;ogImage=true"/>',
      string
    );
    assertContains(
      '<meta name="twitter:image" content="https://thumbor.assettype.com/my%2Fimage.png?w=1200&amp;auto=format%2Ccompress&amp;ogImage=true"/>',
      ampPageString
    );
  });

  describe("for collection pages", function() {
    it("pulls images from the collection if present", function() {
      const collection = {
        metadata: {
          "cover-image": {
            "cover-image-s3-key": "my/image.png",
            "cover-image-metadata": {
              width: 2400,
              height: 1260,
              "focus-point": [0, 0]
            }
          }
        }
      };
      const string = getSeoMetadata(
        seoConfig,
        config,
        "home-page",
        { data: { collection: collection } },
        {}
      );
      assertContains(
        '<meta property="og:image" content="https://thumbor.assettype.com/my%2Fimage.png?rect=0%2C0%2C2400%2C1260&amp;w=1200&amp;auto=format%2Ccompress&amp;ogImage=true"/>',
        string
      );
      assertContains(
        '<meta property="og:image:width" content="1200"/>',
        string
      );
      assertContains(
        '<meta property="og:image:height" content="630"/>',
        string
      );
    });

    it("does not add tags if the cover image is missing", function() {
      const collection = {
        metadata: {
          "cover-image": {}
        }
      };
      const string = getSeoMetadata(
        seoConfig,
        config,
        "home-page",
        { data: { collection: collection } },
        {}
      );
      assert.equal("", string);
    });
  });
});
