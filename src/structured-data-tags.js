function ldJson(type, fields) {
  const json = JSON.stringify(Object.assign({}, fields, {"@type": type, "@context": "http://schema.org"}))
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    tag: "script",
    type: "application/ld+json",
    dangerouslySetInnerHTML: {__html: json}
  };
}

function generateCommonData(structuredData = {}, story = {}, publisherConfig = {}) {
  const imageSrc = /^https?.*/.test(publisherConfig['cdn-image']) ? publisherConfig['cdn-image'] : `https://${publisherConfig['cdn-image']}`;
  return {
    'headline' : story.headline,
    "image": [`${imageSrc}/${story['hero-image-s3-key']}?w=480&auto=format%2Ccompress&fit=max`],
    "url": `${publisherConfig['sketches-host']}/${story.slug}`,
    "datePublished": new Date(story['published-at']),
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": structuredData.organization.url,
    },
    "publisher" : Object.assign({}, {
      "@type": "Organization",
      "@context": "http://schema.org"
    }, structuredData.organization)
  }
}

function generateArticleData (structuredData = {}, story = {}, publisherConfig = {}){
  const metaKeywords = story.seo && story.seo['meta-keywords'] || [];
  const { authors = [] } = story;
  const {themeConfig = {}} = publisherConfig["theme-attributes"] || {};

  return Object.assign({}, generateCommonData(structuredData, story, publisherConfig), {
    "author": authors.map(author => ({
      "@type": "Person",
      "givenName": author.name,
      "name": author.name
    })),
    "keywords": metaKeywords,
    "dateCreated": new Date(story['created-at']),
    "dateModified": new Date(story['updated-at']),
  });
}

function generateNewsArticleData (structuredData = {}, story = {}, publisherConfig = {}) {
  const {alternative = {}} = story.alternative || {};
  return Object.assign({}, generateCommonData(structuredData, story, publisherConfig), {
    "alternativeHeadline": (alternative.home && alternative.home.default) ? alternative.home.default.headline : "",
    "description": story.summary,
  });
}

export function StructuredDataTags({structuredData = {}}, config, pageType, response = {}, {url}) {
  const tags = [];
  const {story = {}} = response.data || {};
  const {config: publisherConfig = {}} = response;
  const {articleType = ''} = publisherConfig['publisher-settings'] || {};
  const isStructuredDataEmpty = Object.keys(structuredData).length === 0;
  let articleData = {};

  if(!isStructuredDataEmpty) {
    articleData = generateArticleData(structuredData, story, publisherConfig);
    tags.push(ldJson("Organization", structuredData.organization));
  }

  if(!isStructuredDataEmpty && pageType === 'story-page' && !structuredData.enableNewsArticle) {
    tags.push(ldJson("Article", articleData));
  }

  if(!isStructuredDataEmpty && pageType === 'story-page' && structuredData.enableNewsArticle) {
    const newsArticleData = Object.assign({}, articleData, generateNewsArticleData(structuredData, story, publisherConfig));
    tags.push(ldJson('NewsArticle', newsArticleData));
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}