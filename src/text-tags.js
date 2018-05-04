import {get, isEmpty} from 'lodash';
import {objectToTags} from './utils';

function buildTagsFromStory(config, story, url = {}) {
  if(!story)
    return;

  function getStoryCardMetadata(cardId) {
    const { metadata = {} } = story.cards.find(card => card.id === cardId) || {};
    const urlWithCardId = `${config['sketches-host']}/${story.slug}?cardId=${cardId}`;
    if(metadata && !isEmpty(metadata) &&  metadata['social-share']){
      return {
        title: metadata['social-share'].title || story.headline,
        description: metadata['social-share'].message || story.summary,
        ogUrl: urlWithCardId,
      };
    }
    return metadata;
  }

  const seo = story.seo || {};

  const storyUrl = `${config['sketches-host']}/${story.slug}`;

  const storyMetaData = {
    title: seo["meta-title"] || story.headline,
    "page-title": story.headline,
    description: seo["meta-description"] || story.subheadline || story.summary,
    keywords: (seo["meta-keywords"] || (story.tags || []).map(tag => tag.name)).join(","),
    canonicalUrl: story["canonical-url"] || storyUrl,
    ogUrl: get(seo, ["og", "url"]) || storyUrl,
    storyUrl: storyUrl
  };

  if(url.query && url.query.cardId){
    const storyCardMetadata = getStoryCardMetadata(url.query.cardId);
    return Object.assign({}, storyMetaData, storyCardMetadata); //TODO rewrite in spread syntax, add babel plugin
  }

  return storyMetaData;
}

function getSeoData(config, pageType, data, url = {}) {
  function findRelevantConfig(pred) {
    const seoMetadata = config['seo-metadata'].find(pred) || {};
    return seoMetadata.data;
  }

  switch(pageType) {
    case 'home-page': return findRelevantConfig(page => page['owner-type'] === 'home')
    case 'section-page': return findRelevantConfig(page => page['owner-type'] === 'section' && page['owner-id'] === get(data, ['data', 'section', 'id'])) || getSeoData(config, 'home-page', data, url);
    case 'story-page': return buildTagsFromStory(config, get(data, ["data", "story"]), url) || getSeoData(config, "home-page", data, url);
    default: return getSeoData(config, 'home-page', data, url);
  }
}

export function TextTags(seoConfig, config, pageType, data, {url}) {
  const seoData = getSeoData(config, pageType, data, url);

  if(!seoData)
    return [];

  const currentUrl = `${config['sketches-host']}${url.pathname}`;

  const basicTags = {
    'description': seoData.description,
    'title': seoData.title,
    'keywords': seoData.keywords,
  };

  const ogTags = seoConfig.enableOgTags ? {
    'og:type': pageType == 'story-page' ? 'article' : 'website',
    'og:url': seoData.ogUrl || currentUrl,
    'og:title': seoData.title,
    'og:description': seoData.description
  } : undefined;

  const twitterTags = seoConfig.enableTwitterCards ? {
    'twitter:card': "summary_large_image",
    'twitter:title': seoData.title,
    'twitter:description': seoData.description,
  } : undefined;

  const allTags = Object.assign(basicTags, ogTags, twitterTags);

  const commonTags = [
    {tag: "title", children: data.title || seoData['page-title']},
    {tag: "link", rel: "canonical", href: seoData.canonicalUrl || currentUrl}
  ]

  if(pageType == 'story-page' && seoConfig.enableNews) {
    commonTags.push({name: "news_keywords", content: seoData.keywords});
    if(get(data, ["data", "story", "seo", "meta-google-news-standout"]))
      commonTags.push({tag: "link", rel: "standout", href: seoData.storyUrl || currentUrl});
  }

  return commonTags.concat(objectToTags(allTags));
}

export function getTitle(seoConfig, config, pageType, data, params) {
  if(get(data, ["title"]))
    return get(data, ["title"]);

  if(get(data, ["data", "title"]))
    return get(data, ["data", "title"]);

  const seoData = getSeoData(config, pageType, data) || {};
  return seoData['page-title'];
}
