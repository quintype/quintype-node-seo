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

export function StructuredDataTags({structuredData = {}}, config, pageType, data, {url}) {
  const tags = [];

  if(structuredData.organization) {
    tags.push(ldJson("Organization", structuredData.organization))
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}
