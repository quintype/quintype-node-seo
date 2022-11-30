const { AuthorTags } = require("..");
const { getSeoMetadata } = require("./utils");
const assert = require("assert");

describe("AuthorTags", function () {
  it("should take twitter handle of author if present", function () {
    const storyPageMockData = {
      data: {
        story: {
          "author-name": "John Doe",
          authors: [
            {
              slug: "john-doe",
              social: {
                twitter: {
                  url: "https://twitter.com/JohnDoe123",
                  handle: "@JohnDoe123",
                },
              },
              name: "John Doe",
            },
          ],
        },
      },
    };
    const seoConfig = {
      generators: [AuthorTags],
    };
    const string = getSeoMetadata(seoConfig, {}, "story-page", storyPageMockData, {});
    assert.equal('<meta name="twitter:creator" content="@JohnDoe123"/>', string);
  });

  it("should generate twitter handle from url if twitter handle is not present", function () {
    const storyPageMockData = {
      data: {
        story: {
          "author-name": "John Doe",
          authors: [
            {
              slug: "john-doe",
              social: {
                twitter: {
                  url: "https://twitter.com/JohnDoe123",
                  handle: "",
                },
              },
              name: "John Doe",
            },
          ],
        },
      },
    };
    const seoConfig = {
      generators: [AuthorTags],
    };
    const string = getSeoMetadata(seoConfig, {}, "story-page", storyPageMockData, {});
    assert.equal('<meta name="twitter:creator" content="@JohnDoe123"/>', string);
  });

  it("should correctly generate twitter handle from url", function () {
    const storyPageMockData = {
      data: {
        story: {
          "author-name": "John Doe",
          authors: [
            {
              slug: "john-doe",
              social: {
                twitter: {
                  url: "https://twitter.com/@JohnDoe123",
                  handle: "",
                },
              },
              name: "John Doe",
            },
          ],
        },
      },
    };
    const seoConfig = {
      generators: [AuthorTags],
    };
    const string = getSeoMetadata(seoConfig, {}, "story-page", storyPageMockData, {});
    assert.equal('<meta name="twitter:creator" content="@JohnDoe123"/>', string);
  });
  it("should take author name for twitter:creator if no twitter data about author is present", function () {
    const storyPageMockData = {
      data: {
        story: {
          "author-name": "John Doe",
          authors: [
            {
              slug: "john-doe",
              name: "John Doe",
            },
          ],
        },
      },
    };
    const seoConfig = {
      generators: [AuthorTags],
    };
    const string = getSeoMetadata(seoConfig, {}, "story-page", storyPageMockData, {});
    assert.equal('<meta name="twitter:creator" content="John Doe"/>', string);
  });
});
