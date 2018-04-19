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
  return {
    "author": authors.map(author => ({
        "@type": "Person",
        "givenName": author.name,
        "name": author.name
    })),
    "editor": story['owner-name'],
    "keywords": metaKeywords,
    "publisher": publisherConfig['publisher-name'],
    "url": `${publisherConfig['sketches-host']}/${story.slug}`,
    "dateCreated": new Date(story['created-at']),
    "dateModified": new Date(story['updated-at']),
  }
}

function generateNewsArticleData (story = {}, publisherConfig = {}) {
  return {
    'headline' : story.headline,
    "alternativeHeadline": story.subheadline,
    "image": [`${publisherConfig['cdn-image']}/${story['hero-image-s3-key']}`],
    "datePublished": new Date(story['published-at']),
    "description": story.summary,
  };
}

export function StructuredDataTags({structuredData = {}}, config, pageType, data = {}, {url}) {
  const tags = [];
  const {story = {}} = data.data;
  const {config: publisherConfig = {}} = data;
  const {articleType = ''} = publisherConfig['publisher-settings'] || {};

  const articleData = generateArticleData(story, publisherConfig);

  tags.push(ldJson("Article", articleData));

  if(structuredData.organization) {
    tags.push(ldJson("Organization", structuredData.organization));
  }

  if(articleType === 'news-article') {
    const newsArticleData = Object.assign({}, articleData, generateNewsArticleData(story, publisherConfig));
    tags.push(ldJson('NewsArticle', newsArticleData));
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}
