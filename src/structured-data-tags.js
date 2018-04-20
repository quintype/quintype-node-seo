function ldJson(type, fields) {
  const json = JSON.stringify(Object.assign({"@type": type, "@context": "http://schema.org"}, fields))
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    tag: "script",
    type: "application/ld+json",
    dangerouslySetInnerHTML: {__html: json}
  };
}

function generateArticleData (story = {}, publisherConfig = {}){
  const metaKeywords = story.seo && story.seo['meta-keywords'] || [];
  const { authors = [] } = story;
  const {themeConfig = {}} = publisherConfig["theme-attributes"] || {};

  return {
    "author": authors.map(author => ({
      "@type": "Person",
      "givenName": author.name,
      "name": author.name
    })),
    "keywords": metaKeywords,
    "url": `${publisherConfig['sketches-host']}/${story.slug}`,
    "dateCreated": new Date(story['created-at']),
    "dateModified": new Date(story['updated-at']),
  }
}

function generateNewsArticleData (story = {}, publisherConfig = {}) {
  const {alternative = {}} = story.alternative || {};
  return {
    'headline' : story.headline,
    "alternativeHeadline": (alternative.home && alternative.home.default) ? alternative.home.default.headline : "",
    "image": [`${publisherConfig['cdn-image']}/${story['hero-image-s3-key']}?w=480&auto=format%2Ccompress&fit=max`],
    "datePublished": new Date(story['published-at']),
    "description": story.summary,
  };
}

export function StructuredDataTags({structuredData = {}}, config, pageType, response = {}, {url}) {
  const tags = [];
  const {story = {}} = response.data || {};
  const {config: publisherConfig = {}} = response;
  const {articleType = ''} = publisherConfig['publisher-settings'] || {};

  const articleData = generateArticleData(story, publisherConfig);

  tags.push(ldJson("Article", articleData));

  if(structuredData.organization) {
    tags.push(ldJson("Organization", structuredData.organization));
  }

  if(structuredData.organization && structuredData.enableNewsArticle) {
    const publisherObject = {
      "@type": "Organization",
      "@context": "http://schema.org",
      "publisher" : structuredData.organization
    };
    const newsArticleData = Object.assign({}, articleData, generateNewsArticleData(story, publisherConfig), publisherObject);
    tags.push(ldJson('NewsArticle', newsArticleData));
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}
