import {get} from 'lodash';
import {objectToTags} from './utils';

export function TextTags(seoConfig, config, pageType, data, {url}) {

  function findRelevantConfig(pred) {
    const seoMetadata = config['seo-metadata'].find(pred) || {};
    return seoMetadata.data;
  }

  function getSeoData(pageType) {
    switch(pageType) {
      case 'home-page': return findRelevantConfig(page => page['owner-type'] === 'home')
      case 'section-page': return findRelevantConfig(page => page['owner-type'] === 'section' && page['owner-id'] === get(data, ['data', 'section', 'id'])) || getSeoData('home-page');
      default: return getSeoData('home-page');
    }
  }

  const seoData = getSeoData(pageType);

  if(!seoData)
    return [];

  const basicTags = {
    'description': seoData.description,
    'title': seoData.title,
    'keywords': seoData.keywords,
  };

  const newsTags = seoConfig.enableNews && pageType == 'story' ? {
    "news_keywords": seoData.keywords
  } : undefined;

  const ogTags = seoConfig.enableOgTags ? {
    'og:type': pageType == 'story-page' ? 'article' : 'website',
    'og:url': `${config['sketches-host']}${url.pathname}`,
    'og:title': seoData.title,
    'og:description': seoData.description
  } : undefined;

  const twitterTags = seoConfig.enableTwitterCards ? {
    'twitter:card': "summary_large_image",
    'twitter:title': seoData.title,
    'twitter:description': seoData.description,
  } : undefined;

  const allTags = Object.assign(basicTags, newsTags, ogTags, twitterTags);

  const titleAndCanonical = [
    {tag: "title", children: data.title || seoData['page-title']},
    {tag: "link", rel: "canonical", href: `${config['sketches-host']}${url.pathname}`}
  ]

  return titleAndCanonical.concat(objectToTags(allTags));
}
