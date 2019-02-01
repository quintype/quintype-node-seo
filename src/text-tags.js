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
        ogTitle: metadata['social-share'].title || story.headline,
        ogDescription: metadata['social-share'].message || story.summary
      };
    }
    return metadata;
  }

  const seo = story.seo || {};

  const storyUrl = `${config['sketches-host']}/${story.slug}`;

  const storyMetaData = {
    title: seo["meta-title"] || story.headline,
    "page-title": seo["meta-title"] || story.headline,
    description: seo["meta-description"] || story.summary,
    keywords: (seo["meta-keywords"] || (story.tags || []).map(tag => tag.name)).join(","),
    canonicalUrl: story["canonical-url"] || storyUrl,
    ogUrl: get(seo, ["og", "url"]) || storyUrl,
    ogTitle: story.headline,
    ogDescription: story.summary,
    storyUrl: storyUrl
  };

  if(url.query && url.query.cardId){
    const storyCardMetadata = getStoryCardMetadata(url.query.cardId);
    return Object.assign({}, storyMetaData, storyCardMetadata); //TODO rewrite in spread syntax, add babel plugin
  }

  return storyMetaData;
}

function buildTagsFromTopic(config, tag, url = {}) {

  if(isEmpty(tag))
    return;

  const topicMetaData = {
    "page-title":tag.name,
    description: tag.description || tag.name,
    keywords: tag.name,
    canonicalUrl: `${config['sketches-host']}${tag.path}`,
    ogUrl: `${config['sketches-host']}${tag.path}`,
    ogTitle: tag.name,
    ogDescription: tag.tagDescription || tag.name
  };

  return topicMetaData;
}

function buildTagsFromAuthor(config, author, url = {}) {
  if(isEmpty(author)) return;

  const authorName = author.name;
  const authorUrl = `${config['sketches-host']}${url.pathname}`;
  const description = author.bio || `View all articles written by ${authorName}`;

  return {
    title: authorName,
    "page-title": authorName,
    description: description,
    keywords: `${authorName},${config['publisher-name']}`,
    canonicalUrl: authorUrl,
    ogUrl: authorUrl,
    ogTitle: authorName,
    ogDescription: description,
  };
}

function buildCustomTags(customTags = {}, pageType = ''){
  const configObject = customTags[pageType];
  if(configObject) {
    return configObject;
  }
  return {};
}

function getSeoData(config, pageType, data, url = {}, seoConfig = {}) {
  function findRelevantConfig(pred) {
    const seoMetadata = config['seo-metadata'].find(pred) || {};
    const {sections = []} = config;
    if(seoMetadata.data && (!seoMetadata.data['page-title'] || !seoMetadata.data['title'])) {
      const sectionData = sections.find(section => section.id === seoMetadata['owner-id']) || {};
      seoMetadata.data['page-title'] = seoMetadata.data['page-title'] || sectionData.name;
      seoMetadata.data['title'] = seoMetadata.data['title'] || sectionData.name;
    }
    if(seoMetadata.data && !seoMetadata.data['description']) {
      const homeSeoData = config['seo-metadata'].find(page => page['owner-type'] === 'home') || {};
      seoMetadata.data['description'] = (homeSeoData.data && homeSeoData.data.description) ? homeSeoData.data.description : '';
    }
    if(seoMetadata.data) {
      seoMetadata.data['ogTitle'] = seoMetadata.data['title'];
      seoMetadata.data['ogDescription'] = seoMetadata.data['description'];
    }
    return seoMetadata.data;
  }

  if(seoConfig.customTags && seoConfig.customTags[pageType]){
    return buildCustomTags(seoConfig.customTags, pageType);
  }

  switch(pageType) {
    case 'home-page': return findRelevantConfig(page => page['owner-type'] === 'home')
    case 'section-page': return findRelevantConfig(page => page['owner-type'] === 'section' && page['owner-id'] === get(data, ['data', 'section', 'id'])) || getSeoData(config, 'home-page', data, url);
    case 'tag-page': return buildTagsFromTopic(config, get(data, ["data", "tag"]), url) || getSeoData(config, "home-page", data, url);
    case 'story-page': return buildTagsFromStory(config, get(data, ["data", "story"]), url) || getSeoData(config, "home-page", data, url);
    case 'visual-story': return buildTagsFromStory(config, get(data, ["story"]), url) || getSeoData(config, "home-page", data, url);
    case 'author-page': return buildTagsFromAuthor(config, get(data, ["data", "author"], {}), url) || getSeoData(config, "home-page", data, url);
    default: return getSeoData(config, 'home-page', data, url);
  }
}

export function TextTags(seoConfig, config, pageType, data, {url}) {
  const seoData = getSeoData(config, pageType, data, url, seoConfig);

  if(!seoData)
    return [];

  const currentUrl = `${config['sketches-host']}${url.pathname}`;

  const basicTags = {
    'description': seoData.description,
    'title': seoData.title,
    'keywords': seoData.keywords,
  };

  const ogTags = seoConfig.enableOgTags ? {
    'og:type': pageType === 'story-page' ? 'article' : 'website',
    'og:url': seoData.ogUrl || currentUrl,
    'og:title': seoData.ogTitle,
    'og:description': seoData.ogDescription
  } : undefined;

  const twitterTags = seoConfig.enableTwitterCards ? {
    'twitter:card': "summary_large_image",
    'twitter:title': pageType === 'story-page' ? get(data, ['data', 'story', 'headline'], 'error') : seoData.title,
    'twitter:description': seoData.description,
  } : undefined;

  const allTags = Object.assign(basicTags, ogTags, twitterTags);

  const commonTags = [
    {tag: "title", children: data.title || seoData['page-title']},
    {tag: "link", rel: "canonical", href: seoData.canonicalUrl || currentUrl}
  ];

  if(pageType === 'story-page' && seoConfig.enableNews) {
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

  const seoData = getSeoData(config, pageType, data, undefined, seoConfig) || {};
  return seoData['page-title'];
}