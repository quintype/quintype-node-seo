const { StructuredDataTags } = require("..");
const { getSeoMetadata, assertContains, assertDoesNotContains } = require("./utils");

const assert = require("assert");
const url = require("url");

const organization = {
  name: "Quintype",
  url: "http://www.quintype.com/",
  logo: "https://quintype.com/logo.png",
  sameAs: [
    "https://www.facebook.com/quintype",
    "https://twitter.com/quintype_inc",
    "https://plus.google.com/+quintype",
    "https://www.youtube.com/user/Quintype",
  ],
};

const website = {
  url: "https://madrid.quintype.io",
  searchpath: "search?q={query}",
  queryinput: "required name=query",
};

const header = {
  cssSelector: "#header",
};

const footer = {
  cssSelector: "#footer",
};
function getSeoConfig({
  newsArticle = false,
  liveBlog = false,
  video = false,
  storyUrlAsMainEntityUrl = false,
  stripHtmlFromArticleBody = false,
  headerConfig,
  footerConfig,
  authorSchema = [],
} = {}) {
  return {
    generators: [StructuredDataTags],
    structuredData: {
      organization,
      website,
      header: headerConfig,
      footer: footerConfig,
      enableNewsArticle: newsArticle,
      enableLiveBlog: liveBlog,
      enableVideo: video,
      authorSchema: () => authorSchema,
      stripHtmlFromArticleBody: stripHtmlFromArticleBody,
      storyUrlAsMainEntityUrl: storyUrlAsMainEntityUrl,
    },
  };
}

function sampleAuthorsData() {
  return [
    {
      id: 482995,
      name: "Greeshma",
      slug: "greeshma",
      "avatar-url":
        "https://images.assettype.com/quintype-demo/2018-03/9a16b150-6281-45e6-bdb9-6eb1146e1a54/50b1da06-b478-4bc8-8067-fada337c55d0.jpeg",
      "avatar-s3-key":
        "quintype-demo/2018-03/9a16b150-6281-45e6-bdb9-6eb1146e1a54/50b1da06-b478-4bc8-8067-fada337c55d0.jpeg",
      "twitter-handle": null,
      bio: null,
    },
  ];
}

function sampleStoryData(template, cards, authors, access, opts) {
  return {
    data: {
      story: {
        "story-template": template,
        access: access,
        seo: {
          "meta-description": "",
          "meta-title": " Why publishers need to use personalised content",
          "meta-keywords": [],
          "meta-google-news-standout": false,
          "claim-reviews": {
            story: null,
          },
        },
        "author-name": "Greeshma",
        tags: [],
        sections: [
          {
            slug: "section-name",
            name: "Section Name",
            id: 3920,
            "parent-id": 2584,
            "display-name": "Section Name",
            collection: {
              slug: "section-name",
              name: "Section Name",
              id: 9000,
            },
            data: null,
          },
        ],
        headline: "Personalise or perish - Why publishers need to use personalised content",
        slug: "politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content",
        "last-published-at": 1524204205102,
        alternative: {
          home: {
            default: {
              headline: "Personalise or perish",
            },
          },
        },
        "content-created-at": 1519814417485,
        "owner-name": "Greeshma",
        "hero-image-metadata": {
          width: 1920,
          height: 1280,
          "mime-type": "image/jpeg",
          "focus-point": [931, 901],
        },
        "published-at": 1524204205102,
        summary: "Personalised content marketing is the slayer weapon in this war for attention and engagement.",
        "hero-image-s3-key":
          "quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg",
        cards: cards,
        "content-updated-at": 1524204468980,
        "first-published-at": 1519816264773,
        "created-at": 1524204200588,
        "updated-at": 1524204200588,
        authors: authors,
        metadata: {
          "card-share": {
            shareable: true,
          },
        },
        "publish-at": null,
        ...opts,
      },
    },
    config: {
      "cdn-image": "images.assettype.com",
      "sketches-host": "https://madrid.quintype.io",
      "publisher-name": "quintype-demo",
      "publisher-settings": {
        title: "Quintype Demo",
        copyright: "© quintype-demo 2018",
      },
      "social-links": {
        "facebook-url": "https://www.facebook.com/quintypeinc",
        "twitter-url": "https://twitter.com/quintype_inc",
      },
    },
  };
}

const sampleOrganisationTag =
  '<script type="application/ld+json">{"name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"@type":"Organization","@context":"http://schema.org"}</script>';
const sampleWebsiteTag =
  '<script type="application/ld+json">{"@context":"http://schema.org","@type":"Website","url":"https://madrid.quintype.io","interactivityType":"mixed","copyrightHolder":{"@type":"Organization"},"potentialAction":{"@type":"SearchAction","target":"https://madrid.quintype.io/search?q={query}","query-input":"required name=query"},"mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io"}}</script>';
const sampleHeaderTag =
  '<script type="application/ld+json">{"@context":"http://schema.org","@type":"WPHeader","cssSelector":"#header"}</script>';
const sampleFooterTag =
  '<script type="application/ld+json">{"@context":"http://schema.org","@type":"WPFooter","cssSelector":"#footer"}</script>';
const sampleBreadcrumbListTag =
  '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Film","item":"https://madrid.quintype.io/film"}]}</script>';

describe("StructuredDataTags", function () {
  it("puts the organization & website tag", function () {
    const string = getSeoMetadata(getSeoConfig({}), {}, "home-page", {}, { url: url.parse("/") });
    assertContains(sampleOrganisationTag + sampleWebsiteTag, string);
  });

  it("puts the organization tag for home page not for other pages", function () {
    const string = getSeoMetadata(getSeoConfig({}), {}, "home-page", {}, { url: url.parse("/") });
    assertContains(sampleOrganisationTag + sampleWebsiteTag, string);
    const storyString = getSeoMetadata(
      getSeoConfig({ newsArticle: false }),
      {},
      "story-page",
      sampleStoryData(null, [], sampleAuthorsData()),
      { url: url.parse("/") }
    );
    const storyStringAmp = getSeoMetadata(
      getSeoConfig({ newsArticle: false }),
      {},
      "story-page-amp",
      sampleStoryData(null, [], sampleAuthorsData()),
      { url: url.parse("/") }
    );
    assertContains(
      '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
      storyString
    );
    assertContains(
      '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
      storyStringAmp
    );
  });

  it("should not break and don't show structured data if header & footer config is not present", function () {
    const string = getSeoMetadata(getSeoConfig(), {}, "home-page", {}, { url: url.parse("/") });
    assertDoesNotContains(sampleHeaderTag + sampleFooterTag, string);
  });

  it("shoult put the header & footer tag", function () {
    const string = getSeoMetadata(
      getSeoConfig({ headerConfig: header, footerConfig: footer }),
      {},
      "home-page",
      {},
      { url: url.parse("/") }
    );
    assertContains(sampleHeaderTag + sampleFooterTag, string);
  });

  // describe("with authorSchema data ", function () {
  //   it("generate custom author url in Person Schema when authorSchema is present", function () {
  //     const cards = [
  //       {
  //         "card-added-at": 1519816264773,
  //         "card-updated-at": 1524204205102,
  //         "story-elements": [
  //           {
  //             type: "title",
  //             text: "BQ Live: Hot Money",
  //           },
  //           {
  //             type: "jsembed",
  //             metadata: {
  //               "vidible-video-id": "59bb646192fdde488f02624e",
  //             },
  //             subtype: "vidible-video",
  //           },
  //           {
  //             "image-s3-key": "bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG",
  //             type: "image",
  //           },
  //           {
  //             type: "text",
  //             text: "BQ Live: Hot Money and stocks",
  //           },
  //           {
  //             type: "text",
  //             text: "BQ Live: Hot Money and stocks body",
  //           },
  //         ],
  //       },
  //       {
  //         "card-added-at": 1519816264773,
  //         "card-updated-at": 1524204205102,
  //         "story-elements": [
  //           {
  //             type: "title",
  //             text: "BQ Live: Hot Money",
  //           },
  //           {
  //             type: "text",
  //             text: "BQ Live: Hot Money and stocks body-2",
  //           },
  //         ],
  //       },
  //     ];
  //     const getAuthorWithUrl = () => {
  //       return sampleAuthorsData().map((author) => {
  //         return {
  //           name: author.name,
  //           url: `https://madrid.quintype.io/author/${author.id}`,
  //         };
  //       });
  //     };

  //     const string = getSeoMetadata(
  //       getSeoConfig({ newsArticle: true, storyUrlAsMainEntityUrl: true, authorSchema: getAuthorWithUrl() }),
  //       {},
  //       "story-page",
  //       sampleStoryData(null, cards, sampleAuthorsData(), null),
  //       { url: url.parse("/") },
  //       null
  //     );
  //     const ampPageString = getSeoMetadata(
  //       getSeoConfig({ newsArticle: true, storyUrlAsMainEntityUrl: true, authorSchema: getAuthorWithUrl() }),
  //       {},
  //       "story-page-amp",
  //       sampleStoryData(null, cards, sampleAuthorsData(), null),
  //       { url: url.parse("/") },
  //       null
  //     );

  //     assertContains(
  //       '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true&enlarge=true","width":"480","height":"270"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/482995"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","width":"480","height":"270"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","width":"480","height":"270"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/482995"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","width":"480","height":"270"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
  //       string
  //     );
  //     assertContains(
  //       '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true&enlarge=true","width":"1200","height":"750"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/482995"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"750"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"750"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/482995"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"750"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
  //       ampPageString
  //     );
  //   });
  // });
  // describe("without authorSchema data ", function () {
  //   it("generate default author url in Person Schema when authorSchema is not present", function () {
  //     const cards = [
  //       {
  //         "card-added-at": 1519816264773,
  //         "card-updated-at": 1524204205102,
  //         "story-elements": [
  //           {
  //             type: "title",
  //             text: "BQ Live: Hot Money",
  //           },
  //           {
  //             type: "jsembed",
  //             metadata: {
  //               "vidible-video-id": "59bb646192fdde488f02624e",
  //             },
  //             subtype: "vidible-video",
  //           },
  //           {
  //             "image-s3-key": "bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG",
  //             type: "image",
  //           },
  //           {
  //             type: "text",
  //             text: "BQ Live: Hot Money and stocks",
  //           },
  //           {
  //             type: "text",
  //             text: "BQ Live: Hot Money and stocks body",
  //           },
  //         ],
  //       },
  //       {
  //         "card-added-at": 1519816264773,
  //         "card-updated-at": 1524204205102,
  //         "story-elements": [
  //           {
  //             type: "title",
  //             text: "BQ Live: Hot Money",
  //           },
  //           {
  //             type: "text",
  //             text: "BQ Live: Hot Money and stocks body-2",
  //           },
  //         ],
  //       },
  //     ];
  //     const getAuthorWithUrl = () => {
  //       return sampleAuthorsData().map((author) => {
  //         return {
  //           name: author.name,
  //           url: `https://madrid.quintype.io/author/${author.id}`,
  //         };
  //       });
  //     };

  //     const string = getSeoMetadata(
  //       getSeoConfig({ newsArticle: true, storyUrlAsMainEntityUrl: true }),
  //       {},
  //       "story-page",
  //       sampleStoryData(null, cards, sampleAuthorsData(), null),
  //       { url: url.parse("/") },
  //       null
  //     );
  //     const ampPageString = getSeoMetadata(
  //       getSeoConfig({ newsArticle: true, storyUrlAsMainEntityUrl: true }),
  //       {},
  //       "story-page-amp",
  //       sampleStoryData(null, cards, sampleAuthorsData(), null),
  //       { url: url.parse("/") },
  //       null
  //     );

  //     assertContains(
  //       '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","width":"480","height":"270"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","width":"480","height":"270"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","width":"480","height":"270"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=480&h=270&auto=format%2Ccompress&fit=max&enlarge=true","width":"480","height":"270"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
  //       string
  //     );
  //     assertContains(
  //       '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true&enlarge=true","width":"1200","height":"750"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"750"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"750"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=750&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"750"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
  //       ampPageString
  //     );
  //   });
  // });

  describe("with news article data ", function () {
    it("puts the news article when enableNewsArticle truthy in theme-attributes config", function () {
      const cards = [
        {
          "card-added-at": 1519816264773,
          "card-updated-at": 1524204205102,
          "story-elements": [
            {
              type: "title",
              text: "BQ Live: Hot Money",
            },
            {
              type: "jsembed",
              metadata: {
                "vidible-video-id": "59bb646192fdde488f02624e",
              },
              subtype: "vidible-video",
            },
            {
              "image-s3-key": "bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG",
              type: "image",
            },
            {
              type: "text",
              text: "BQ Live: Hot Money and stocks",
            },
            {
              type: "text",
              text: "BQ Live: Hot Money and stocks body",
            },
          ],
        },
        {
          "card-added-at": 1519816264773,
          "card-updated-at": 1524204205102,
          "story-elements": [
            {
              type: "title",
              text: "BQ Live: Hot Money",
            },
            {
              type: "text",
              text: "BQ Live: Hot Money and stocks body-2",
            },
          ],
        },
      ];
      const string = getSeoMetadata(
        getSeoConfig({ newsArticle: true, storyUrlAsMainEntityUrl: true }),
        {},
        "story-page",
        sampleStoryData(null, cards, sampleAuthorsData(), null),
        { url: url.parse("/") },
        null
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ newsArticle: true, storyUrlAsMainEntityUrl: true }),
        {},
        "story-page-amp",
        sampleStoryData(null, cards, sampleAuthorsData(), null),
        { url: url.parse("/") },
        null
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });
    it("puts the`NewsArticle` and removes `Article` when enableNewsArticle value is `withoutArticleSchema` in theme-attributes config", function () {
      const cards = [
        {
          "card-added-at": 1519816264773,
          "card-updated-at": 1524204205102,
          "story-elements": [
            {
              type: "title",
              text: "BQ Live: Hot Money",
            },
          ],
        },
        {
          "card-added-at": 1519816264773,
          "card-updated-at": 1524204205102,
          "story-elements": [
            {
              type: "text",
              text: "Content of the story",
            },
            {
              type: "text",
              text: "Hot Money and stocks body-2",
            },
          ],
        },
      ];
      const string = getSeoMetadata(
        getSeoConfig({
          newsArticle: "withoutArticleSchema",
          storyUrlAsMainEntityUrl: true,
        }),
        {},
        "story-page",
        sampleStoryData(null, cards, sampleAuthorsData(), null),
        { url: url.parse("/") },
        null
      );
      const expectedString = '"@type":"Article","@context":"http://schema.org"}';
      assertDoesNotContains(expectedString, string);
    });
    describe("with isAccessibleForFree", function () {
      it("has no value when access is 'null' or 'public' or 'login'", function () {
        const string1 = getSeoMetadata(
          getSeoConfig({ newsArticle: true }),
          {},
          "story-page",
          sampleStoryData(null, [], sampleAuthorsData(), null),
          { url: url.parse("/") },
          null
        );
        assertContains(
          '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
          string1
        );
        const string2 = getSeoMetadata(
          getSeoConfig({ newsArticle: true }),
          {},
          "story-page",
          sampleStoryData(null, [], sampleAuthorsData(), "public"),
          { url: url.parse("/") },
          null
        );
        assertContains(
          '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
          string2
        );
        const string3 = getSeoMetadata(
          getSeoConfig({ newsArticle: true }),
          {},
          "story-page",
          sampleStoryData(null, [], sampleAuthorsData(), "login"),
          { url: url.parse("/") },
          null
        );
        assertContains(
          '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
          string3
        );
      });
      it("has false when access is 'subscription'", function () {
        const string = getSeoMetadata(
          getSeoConfig({ newsArticle: true }),
          {},
          "story-page",
          sampleStoryData(null, [], sampleAuthorsData(), "subscription"),
          { url: url.parse("/") },
          null
        );
        assertContains(
          '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isAccessibleForFree":false,"isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isAccessibleForFree":false,"isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","isAccessibleForFree":false,"cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
          string
        );
      });
    });

    it("has muli domain support", function () {
      const string = getSeoMetadata(
        getSeoConfig({ newsArticle: true, storyUrlAsMainEntityUrl: true }),
        {},
        "story-page",
        sampleStoryData(null, [], sampleAuthorsData(), null, {
          url: "https://foo.com/",
        }),
        { url: url.parse("/") },
        null
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ newsArticle: true, storyUrlAsMainEntityUrl: true }),
        {},
        "story-page-amp",
        sampleStoryData(null, [], sampleAuthorsData(), null, {
          url: "https://foo.com/",
        }),
        { url: url.parse("/") },
        null
      );
      assertContains("https://foo.com", string);
      assertContains("https://foo.com", ampPageString);
    });
  });

  describe("without news article data ", function () {
    it("puts only the article tag when enableNewsArticle false in theme-attributes config", function () {
      const string = getSeoMetadata(
        getSeoConfig({ newsArticle: false }),
        {},
        "story-page",
        sampleStoryData(null, [], sampleAuthorsData()),
        { url: url.parse("/") }
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ newsArticle: false }),
        {},
        "story-page-amp",
        sampleStoryData(null, [], sampleAuthorsData()),
        { url: url.parse("/") }
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });
  });

  describe("with authors value null in article data", function () {
    it("should fallback to the given author-name", function () {
      const string = getSeoMetadata(getSeoConfig({}), {}, "story-page", sampleStoryData(null, [], null));
      const ampPageString = getSeoMetadata(getSeoConfig({}), {}, "story-page-amp", sampleStoryData(null, [], null));
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });
  });

  describe("with authors value an empty array in article data", function () {
    it("should fallback to the given author-name", function () {
      const string = getSeoMetadata(getSeoConfig({}), {}, "story-page", sampleStoryData(null, [], []));
      const ampPageString = getSeoMetadata(getSeoConfig({}), {}, "story-page", sampleStoryData(null, [], []));
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });
  });

  describe("articleBody content", function () {
    const cards = [
      {
        "card-added-at": 1519816264773,
        "card-updated-at": 1524204205102,
        "story-elements": [
          {
            type: "title",
            text: "BQ Live: Hot Money",
          },
          {
            type: "jsembed",
            metadata: {
              "vidible-video-id": "59bb646192fdde488f02624e",
            },
            subtype: "vidible-video",
          },
          {
            "image-s3-key": "bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG",
            type: "image",
          },
          {
            type: "text",
            text: "<p>BQ Live: Hot Money and stocks</p>",
          },
          {
            type: "text",
            text: "<p>BQ Live: Hot Money and stocks body</p>",
          },
        ],
      },
      {
        "card-added-at": 1519816264773,
        "card-updated-at": 1524204205102,
        "story-elements": [
          {
            type: "title",
            text: "BQ Live: Hot Money",
          },
          {
            type: "text",
            text: "<p>BQ Live: Hot Money and stocks body-2</p>",
          },
        ],
      },
    ];
    it("should strip down html tags from articleBody if the stripHtmlFromArticleBody is true", function () {
      const string = getSeoMetadata(
        getSeoConfig({
          newsArticle: true,
          storyUrlAsMainEntityUrl: true,
          stripHtmlFromArticleBody: true,
        }),
        {},
        "story-page",
        sampleStoryData(null, cards, sampleAuthorsData(), null)
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"BQ Live: Hot Money and stocks.BQ Live: Hot Money and stocks body.BQ Live: Hot Money and stocks body-2","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
    });
    it("should not strip down html tags from articleBody if the stripHtmlFromArticleBody is false", function () {
      const string = getSeoMetadata(
        getSeoConfig({
          newsArticle: true,
          storyUrlAsMainEntityUrl: true,
          stripHtmlFromArticleBody: false,
        }),
        {},
        "story-page",
        sampleStoryData(null, cards, sampleAuthorsData(), null)
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"&lt;p&gt;BQ Live: Hot Money and stocks&lt;/p&gt;.&lt;p&gt;BQ Live: Hot Money and stocks body&lt;/p&gt;.&lt;p&gt;BQ Live: Hot Money and stocks body-2&lt;/p&gt;","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"&lt;p&gt;BQ Live: Hot Money and stocks&lt;/p&gt;.&lt;p&gt;BQ Live: Hot Money and stocks body&lt;/p&gt;.&lt;p&gt;BQ Live: Hot Money and stocks body-2&lt;/p&gt;","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
    });
  });
  describe("with given authors array in article data", function () {
    it("should read from the authors array", function () {
      const string = getSeoMetadata(getSeoConfig({}), {}, "story-page", sampleStoryData(null, [], sampleAuthorsData()));
      const ampPageString = getSeoMetadata(
        getSeoConfig({}),
        {},
        "story-page-amp",
        sampleStoryData(null, [], sampleAuthorsData())
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });
  });

  describe("with video object", function () {
    it("should give the type of video object", function () {
      const string = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page",
        sampleStoryData("video", [], sampleAuthorsData())
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page-amp",
        sampleStoryData("video", [], sampleAuthorsData())
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T06:03:25Z","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T06:03:25Z","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });

    it("uses meta description as description if the card has no summary", function () {
      const options = {
        seo: {
          "meta-description": "Meta description",
        },
        headline: "Personalise or perish - Why publishers need to use personalised content",
        summary: "",
        subheadline: "subheadline",
      };
      const string = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page",
        sampleStoryData("video", [], sampleAuthorsData(), "", options)
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page-amp",
        sampleStoryData("video", [], sampleAuthorsData(), "", options)
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","description":"Meta description","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T06:03:25Z","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","description":"Meta description","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T06:03:25Z","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });

    it("uses headline as description if the card has no summary, meta description and subheadline", function () {
      const options = {
        seo: {
          "meta-description": "",
        },
        headline: "Personalise or perish - Why publishers need to use personalised content",
        summary: "",
        subheadline: "",
      };
      const string = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page",
        sampleStoryData("video", [], sampleAuthorsData(), "", options)
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page-amp",
        sampleStoryData("video", [], sampleAuthorsData(), "", options)
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","description":"Personalise or perish - Why publishers need to use personalised content","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T06:03:25Z","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","description":"Personalise or perish - Why publishers need to use personalised content","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T06:03:25Z","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });

    it("uses subheadline as description if the card has no summary and meta description", function () {
      const options = {
        seo: {
          "meta-description": "",
        },
        headline: "Personalise or perish - Why publishers need to use personalised content",
        summary: "",
        subheadline: "Personalised content marketing is the slayer weapon in this war",
      };
      const string = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page",
        sampleStoryData("video", [], sampleAuthorsData(), "", options)
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page-amp",
        sampleStoryData("video", [], sampleAuthorsData(), "", options)
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","description":"Personalised content marketing is the slayer weapon in this war","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T06:03:25Z","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","description":"Personalised content marketing is the slayer weapon in this war","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T06:03:25Z","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });
  });

  describe("with live blog data", function () {
    it("puts the news article when enableNewsArticle truthy in theme-attributes config", function () {
      const cards = [
        {
          "card-added-at": 1519816264773,
          "card-updated-at": 1524204205102,
          "story-elements": [
            {
              type: "title",
              text: "BQ Live: Hot Money",
            },
            {
              type: "jsembed",
              metadata: {
                "vidible-video-id": "59bb646192fdde488f02624e",
              },
              subtype: "vidible-video",
            },
            {
              "image-s3-key": "bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG",
              type: "image",
            },
          ],
        },
      ];
      const string = getSeoMetadata(
        getSeoConfig({ newsArticle: true, liveBlog: true }),
        {},
        "story-page",
        sampleStoryData("live-blog", cards, sampleAuthorsData()),
        { url: url.parse("/") }
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ newsArticle: true, liveBlog: true }),
        {},
        "story-page-amp",
        sampleStoryData("live-blog", cards, sampleAuthorsData()),
        { url: url.parse("/") }
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","author":"Greeshma","coverageEndTime":"2018-04-20T06:03:25Z","coverageStartTime":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","liveBlogUpdate":[{"@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"articleBody":"","dateModified":"2018-04-20T06:03:25Z","dateCreated":"2018-02-28T11:11:04Z","datePublished":"2018-02-28T11:11:04Z","author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"headline":"BQ Live: Hot Money","image":"https://images.assettype.com/bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"}],"@type":"LiveBlogPosting","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","author":"Greeshma","coverageEndTime":"2018-04-20T06:03:25Z","coverageStartTime":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","liveBlogUpdate":[{"@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"articleBody":"","dateModified":"2018-04-20T06:03:25Z","dateCreated":"2018-02-28T11:11:04Z","datePublished":"2018-02-28T11:11:04Z","author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"headline":"BQ Live: Hot Money","image":"https://images.assettype.com/bloombergquint/2018-07/99423a77-d39a-4803-94c9-1bdc33f95cc6/OI_July_4.PNG?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"}],"@type":"LiveBlogPosting","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });

    it("uses default story headline if the card has no title", function () {
      const cards = [
        {
          "card-added-at": 1519816264773,
          "card-updated-at": 1524204205102,
          "story-elements": [],
        },
      ];
      const string = getSeoMetadata(
        getSeoConfig({ newsArticle: true, liveBlog: true }),
        {},
        "story-page",
        sampleStoryData("live-blog", cards, sampleAuthorsData()),
        { url: url.parse("/") }
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ newsArticle: true, liveBlog: true }),
        {},
        "story-page-amp",
        sampleStoryData("live-blog", cards, sampleAuthorsData()),
        { url: url.parse("/") }
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","author":"Greeshma","coverageEndTime":"2018-04-20T06:03:25Z","coverageStartTime":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","liveBlogUpdate":[{"@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"articleBody":"","dateModified":"2018-04-20T06:03:25Z","dateCreated":"2018-02-28T11:11:04Z","datePublished":"2018-02-28T11:11:04Z","author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"headline":"Personalise or perish - Why publishers need to use personalised content","image":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"}],"@type":"LiveBlogPosting","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","author":"Greeshma","coverageEndTime":"2018-04-20T06:03:25Z","coverageStartTime":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","liveBlogUpdate":[{"@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"articleBody":"","dateModified":"2018-04-20T06:03:25Z","dateCreated":"2018-02-28T11:11:04Z","datePublished":"2018-02-28T11:11:04Z","author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"headline":"Personalise or perish - Why publishers need to use personalised content","image":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"}],"@type":"LiveBlogPosting","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });

    it("uses default story headline if the story has no summary", function () {
      const options = {
        seo: {
          "meta-description": "Meta description",
        },
        headline: "Personalise or perish - Why publishers need to use personalised content",
        summary: "",
        subheadline: "subheadline",
      };

      const cards = [
        {
          "card-added-at": 1519816264773,
          "card-updated-at": 1524204205102,
          "story-elements": [],
        },
      ];

      const string = getSeoMetadata(
        getSeoConfig({ newsArticle: true, liveBlog: true }),
        {},
        "story-page",
        sampleStoryData("live-blog", cards, sampleAuthorsData(), options),
        { url: url.parse("/") }
      );
      const ampPageString = getSeoMetadata(
        getSeoConfig({ newsArticle: true, liveBlog: true }),
        {},
        "story-page-amp",
        sampleStoryData("live-blog", cards, sampleAuthorsData(), options),
        { url: url.parse("/") }
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","author":"Greeshma","coverageEndTime":"2018-04-20T06:03:25Z","coverageStartTime":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","liveBlogUpdate":[{"@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"articleBody":"","dateModified":"2018-04-20T06:03:25Z","dateCreated":"2018-02-28T11:11:04Z","datePublished":"2018-02-28T11:11:04Z","author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"headline":"Personalise or perish - Why publishers need to use personalised content","image":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"}],"@type":"LiveBlogPosting","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","author":"Greeshma","coverageEndTime":"2018-04-20T06:03:25Z","coverageStartTime":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","liveBlogUpdate":[{"@type":"BlogPosting","mainEntityOfPage":{"@type":"WebPage","@id":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"articleBody":"","dateModified":"2018-04-20T06:03:25Z","dateCreated":"2018-02-28T11:11:04Z","datePublished":"2018-02-28T11:11:04Z","author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"headline":"Personalise or perish - Why publishers need to use personalised content","image":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"}],"@type":"LiveBlogPosting","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        ampPageString
      );
    });
  });

  describe("with BreadcrumbList schema", function () {
    it("adds BreadcrumbList schema by default", function () {
      const string = getSeoMetadata(
        getSeoConfig(),
        {},
        "section-page",
        {
          data: {
            section: {
              "section-url": "https://madrid.quintype.io/film",
              slug: "film",
              name: "Film",
            },
          },
          config: {
            "sketches-host": "https://madrid.quintype.io",
            sections: [
              {
                "section-url": "https://madrid.quintype.io/film",
                slug: "film",
                name: "Film",
                "parent-id": null,
              },
            ],
          },
        },
        { url: url.parse("/") }
      );
      assertContains(sampleBreadcrumbListTag, string);
    });
    it("adds BreadcrumbList schema for custom page", function () {
      const string = getSeoMetadata(
        getSeoConfig(),
        {},
        "custom-page",
        {
          data: {
            collection: { slug: "film", name: "Film" },
            breadcrumbs: { name: "Film", url: "https://madrid.quintype.io/film" },
          },
          config: {
            "sketches-host": "https://madrid.quintype.io",
            sections: [
              {
                "section-url": "https://madrid.quintype.io/film",
                slug: "film",
                name: "Film",
                "parent-id": null,
              },
            ],
          },
        },
        { url: url.parse("/") }
      );
      assertContains(sampleBreadcrumbListTag, string);
    });
  });

  describe("custom timezone passed to the payload to return the date property in that timezone", function () {
    it("returns custom date wrt the timezone and the offset", function () {
      const sampleStoryDataObj = sampleStoryData("video", [], sampleAuthorsData(), "");
      sampleStoryDataObj.data.timezone = "Asia/Baku";
      const string = getSeoMetadata(
        getSeoConfig({ video: true, newsArticle: true }),
        {},
        "story-page",
        sampleStoryDataObj
      );
      assertContains(
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T15:11:04+04:00","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","dateCreated":"2018-02-28T15:11:04+04:00","dateModified":"2018-04-20T10:03:25+04:00","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","name":"Personalise or perish - Why publishers need to use personalised content","thumbnailUrl":["https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true"],"uploadDate":"2018-04-20T10:03:25+04:00","embedUrl":"","@type":"VideoObject","@context":"http://schema.org"}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T15:11:04+04:00","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma","url":"https://madrid.quintype.io/author/greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T15:11:04+04:00","dateModified":"2018-04-20T10:03:25+04:00","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"alternativeHeadline":"","description":"Personalised content marketing is the slayer weapon in this war for attention and engagement.","hasPart":[{"@type":"WebPageElement","cssSelector":".paywall"}],"@type":"NewsArticle","@context":"http://schema.org"}</script>',
        string
      );
    });
  });

  context("Structured DataTags for Entity", function () {
    it("generate Structured DataTags for Movie Entities", function () {
      const movieEntity = {
        description: "ABCD",
        "updated-at": 1553600304437,
        slug: "sarkar-movie-2",
        content: "ABCD",
        "publisher-id": 928,
        name: "sarkar",
        type: "movie",
        "meta-description": "ABCD",
        "entity-type-id": 85,
        "deleted-at": null,
        "meta-title": "ABCD",
        actors: [
          {
            id: 128875,
            name: "Aishwarya Dutta",
          },
          {
            id: 128874,
            name: "Shariq Hassan",
          },
          {
            id: 128880,
            name: "Nithya",
          },
          {
            id: 128872,
            name: "Ramya (NSK)",
          },
        ],
        "created-by": 307186,
        photo: [
          {
            key: "vikatandry2/2019-03/97ff1197-f723-4745-8394-442c0f1b1dfa/0.jpg",
            url: "http://thumbor-stg.assettype.com/vikatandry2/2019-03/97ff1197-f723-4745-8394-442c0f1b1dfa/0.jpg",
            caption: "ABCD",
            metadata: {
              "mime-type": "image/jpeg",
            },
            attribution: "ABCD",
          },
        ],
        id: 128930,
        directors: [
          {
            id: 128873,
            name: "Ritvika",
          },
          {
            id: 128880,
            name: "Nithya",
          },
        ],
        producers: [
          {
            id: 128883,
            name: "Vajpayee",
          },
          {
            id: 128873,
            name: "Ritvika",
          },
          {
            id: 128879,
            name: "Mumtaj",
          },
        ],
        "tamil-name": "சர்கார்",
        "last-updated-by": 307186,
        "created-at": 1553600077425,
      };

      const storyData = sampleStoryData();
      storyData.data.story.cards = [];
      storyData.data["linkedEntities"] = [movieEntity];
      const tags = getSeoMetadata(getSeoConfig(), {}, "story-page", storyData, {
        url: url.parse("/"),
      });
      const tagsAmpPage = getSeoMetadata(getSeoConfig(), {}, "story-page-amp", storyData, { url: url.parse("/") });
      const articleTag =
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>';
      const ampArticleTag =
        '<script type="application/ld+json">{"@context":"http://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://madrid.quintype.io"},{"@type":"ListItem","position":2,"name":"Section Name","item":""},{"@type":"ListItem","position":3,"name":"Personalise or perish - Why publishers need to use personalised content","item":""}]}</script><script type="application/ld+json">{"headline":"Personalise or perish - Why publishers need to use personalised content","image":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"},"url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","datePublished":"2018-02-28T11:11:04Z","mainEntityOfPage":{"@type":"WebPage","@id":"http://www.quintype.com/"},"publisher":{"@type":"Organization","@context":"http://schema.org","name":"Quintype","url":"http://www.quintype.com/","logo":"https://quintype.com/logo.png","sameAs":["https://www.facebook.com/quintype","https://twitter.com/quintype_inc","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],"id":"http://www.quintype.com/"},"author":[{"@type":"Person","givenName":"Greeshma","name":"Greeshma"}],"keywords":"","thumbnailUrl":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","articleBody":"","dateCreated":"2018-02-28T11:11:04Z","dateModified":"2018-04-20T06:03:25Z","name":"Personalise or perish - Why publishers need to use personalised content","isPartOf":{"@type":"WebPage","url":"https://madrid.quintype.io/politics/2018/02/28/personalise-or-perish---why-publishers-need-to-use-personalised-content","primaryImageOfPage":{"@type":"ImageObject","url":"https://images.assettype.com/quintype-demo/2018-03/a27aafbf-8a27-4f42-b78f-769eb04655d6/efa66751-e534-4a18-8ebe-e02189c356d9.jpg?w=1200&h=675&auto=format%2Ccompress&fit=max&enlarge=true","width":"1200","height":"675"}},"articleSection":"Section Name","@type":"Article","@context":"http://schema.org"}</script>';
      assertContains(
        articleTag +
          '<script type="application/ld+json">{"actors":[{"@type":"Person","givenName":"Aishwarya Dutta","name":"Aishwarya Dutta"},{"@type":"Person","givenName":"Shariq Hassan","name":"Shariq Hassan"},{"@type":"Person","givenName":"Nithya","name":"Nithya"},{"@type":"Person","givenName":"Ramya (NSK)","name":"Ramya (NSK)"}],"directors":[{"@type":"Person","givenName":"Ritvika","name":"Ritvika"},{"@type":"Person","givenName":"Nithya","name":"Nithya"}],"name":"sarkar","sameAs":"","description":"ABCD","producer":[{"@type":"Person","givenName":"Vajpayee","name":"Vajpayee"},{"@type":"Person","givenName":"Ritvika","name":"Ritvika"},{"@type":"Person","givenName":"Mumtaj","name":"Mumtaj"}],"image":"http://thumbor-stg.assettype.com/vikatandry2/2019-03/97ff1197-f723-4745-8394-442c0f1b1dfa/0.jpg","dateCreated":"2019-03-26T11:34:37.425Z","@type":"Movie","@context":"http://schema.org"}</script>',
        tags
      );
      assertContains(
        ampArticleTag +
          '<script type="application/ld+json">{"actors":[{"@type":"Person","givenName":"Aishwarya Dutta","name":"Aishwarya Dutta"},{"@type":"Person","givenName":"Shariq Hassan","name":"Shariq Hassan"},{"@type":"Person","givenName":"Nithya","name":"Nithya"},{"@type":"Person","givenName":"Ramya (NSK)","name":"Ramya (NSK)"}],"directors":[{"@type":"Person","givenName":"Ritvika","name":"Ritvika"},{"@type":"Person","givenName":"Nithya","name":"Nithya"}],"name":"sarkar","sameAs":"","description":"ABCD","producer":[{"@type":"Person","givenName":"Vajpayee","name":"Vajpayee"},{"@type":"Person","givenName":"Ritvika","name":"Ritvika"},{"@type":"Person","givenName":"Mumtaj","name":"Mumtaj"}],"image":"http://thumbor-stg.assettype.com/vikatandry2/2019-03/97ff1197-f723-4745-8394-442c0f1b1dfa/0.jpg","dateCreated":"2019-03-26T11:34:37.425Z","@type":"Movie","@context":"http://schema.org"}</script>',
        tagsAmpPage
      );
    });
  });
});
