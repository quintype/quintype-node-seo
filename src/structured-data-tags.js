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

export function StructuredDataTags({structuredData = {}}, config, pageType, data = {}, {url}) {
  const tags = [];
  const {story = {}, config: publisherConfig = {}} = data.data;
  const {storyType = ''} = publisherConfig['publisher-settings'] || {};


  const articleStructureData = {
    'headline' : story.headline,
    "alternativeHeadline": story.subheadline,
    "image": [`${publisherConfig['cdn-image']}/${story['hero-image-s3-key']}`],
    "datePublished": new Date(story['published-at']),
    "description": story.summary,
  };

  if(structuredData.organization) {
    tags.push(ldJson("Organization", structuredData.organization));
  }

  if(storyType === 'news-article') {
    tags.push(ldJson('news-article', articleStructureData));
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}
