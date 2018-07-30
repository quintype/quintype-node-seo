function ldJsonFields(type, fields) {
  return Object.assign({}, fields, {"@type": type, "@context": "http://schema.org"});
}

function ldJson(type, fields) {
  const json = JSON.stringify(ldJsonFields(type, fields))
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    tag: "script",
    type: "application/ld+json",
    dangerouslySetInnerHTML: {__html: json}
  };
}

function imageUrl(publisherConfig, s3Key) {
  const imageSrc = /^https?.*/.test(publisherConfig['cdn-image']) ? publisherConfig['cdn-image'] : `https://${publisherConfig['cdn-image']}`;
  return `${imageSrc}/${s3Key}?w=480&auto=format%2Ccompress&fit=max`;
}

function generateCommonData(structuredData = {}, story = {}, publisherConfig = {}) {

  return {
    'headline' : story.headline,
    "image": [imageUrl(publisherConfig, story['hero-image-s3-key'])],
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

function authorData(authors) {
  return (authors || []).map(author => ({
    "@type": "Person",
    "givenName": author.name,
    "name": author.name
  }));
}

function generateArticleData (structuredData = {}, story = {}, publisherConfig = {}){
  const metaKeywords = story.seo && story.seo['meta-keywords'] || [];
  const authors = story.authors ? story.authors : [{name: story["author-name"] || ""}];

  return Object.assign({}, generateCommonData(structuredData, story, publisherConfig), {
    "author": authorData(authors),
    "keywords": metaKeywords,
    "dateCreated": new Date(story['created-at']),
    "dateModified": new Date(story['updated-at']),
  });
}

function generateNewsArticleData (structuredData = {}, story = {}, publisherConfig = {}) {
  const {alternative = {}} = story.alternative || {};
  return {
    "alternativeHeadline": (alternative.home && alternative.home.default) ? alternative.home.default.headline : "",
    "description": story.summary,
  };
}

function findStoryElementField(card, type, field, defaultValue) {
  const elements = card['story-elements'].filter(e => e.type == type || e.subtype == type);
  if(elements.length > 0)
    return elements[0][field];
  else
    return defaultValue;
}

function generateLiveBlogPostingData (structuredData = {}, story = {}, publisherConfig = {}){
  return {
    "coverageEndTime": new Date(story['last-published-at']),
    "coverageStartTime": new Date(story['created-at']),
    "liveBlogUpdate": story.cards.map(card => {
      return {
        "@type": "BlogPosting",
        "dateModified": new Date(card['card-updated-at']),
        "dateCreated": new Date(card['card-added-at']),
        "author": authorData(story.authors),
        "headline": findStoryElementField(card, "title", "text", story.headline),
        "image": imageUrl(publisherConfig, findStoryElementField(card, "image", "image-s3-key", story['hero-image-s3-key'])),
        //video, articleBody
      };
    }),
  };
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

  if(!isStructuredDataEmpty && pageType == 'story-page') {
    tags.push(storyTags());
  }

  function storyTags() {
    if(structuredData.enableLiveBlog && story['story-template'] == 'live-blog') {
      return ldJson("LiveBlogPosting", Object.assign({}, articleData, generateLiveBlogPostingData(structuredData, story, publisherConfig)))
    }

    if(structuredData.enableNewsArticle) {
      return ldJson('NewsArticle', Object.assign({}, articleData, generateNewsArticleData(structuredData, story, publisherConfig)))
    }

    return ldJson("Article", articleData);
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}