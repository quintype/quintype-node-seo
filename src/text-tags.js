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

  const storyUrl = story.url || `${config['sketches-host']}/${story.slug}`;

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

  const tagName = tag.name;
  const tagDescription = tag['meta-description'];
  const description = `Read stories listed under on ${tagName}`;
  const tagUrl = `${config['sketches-host']}${url.pathname}`
  const topicMetaData = {
    title: tagName,
    "page-title": tagName,
    description: tagDescription || description,
    keywords: tagName,
    canonicalUrl: tagUrl,
    ogUrl: tagUrl,
    ogTitle: tagName,
    ogDescription: tagDescription || description
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


// The findRelevantConfig method call has no ownerId for home page.
// This causes the seoMetadata to be undefined.
// So the default value for the ownerId is set to null.

function getSeoData(config, pageType, data, url = {}, seoConfig = {}) {
  function findRelevantConfig(ownerType, ownerId = null) {
    const seoMetadata = config['seo-metadata'].find(page => page["owner-type"] === ownerType && page["owner-id"] === ownerId) || {};
    const { sections = [] } = config;
    const section = sections.find(section => ownerType == 'section' && section.id === ownerId) || {};

    if(seoMetadata.data || section.id) {
      const result = Object.assign({}, {
        'page-title': section.name,
        title: section.name,
        canonicalUrl: section['section-url'] || undefined,
      }, seoMetadata.data);

      if(!result.description) {
        const homeSeoData = config['seo-metadata'].find(page => page['owner-type'] === 'home') || {data: {description: ""}};
        result.description = homeSeoData.data.description;
      }

      result.ogTitle = result.title;
      result.ogDescription = result.description;
      return result;
    }
  }

  if(seoConfig.customTags && seoConfig.customTags[pageType]){
    return buildCustomTags(seoConfig.customTags, pageType);
  }

  switch(pageType) {
    case 'home-page': return findRelevantConfig('home')
    case 'section-page': return findRelevantConfig('section', get(data, ['data', 'section', 'id'])) || getSeoDataFromCollection(config, data) || getSeoData(config, 'home-page', data, url);
    case 'tag-page': return buildTagsFromTopic(config, get(data, ["data", "tag"]), url) || getSeoData(config, "home-page", data, url);
    case 'story-page': return buildTagsFromStory(config, get(data, ["data", "story"]), url) || getSeoData(config, "home-page", data, url);
    case 'visual-story': return buildTagsFromStory(config, get(data, ["story"]), url) || getSeoData(config, "home-page", data, url);
    case 'author-page': return buildTagsFromAuthor(config, get(data, ["data", "author"], {}), url) || getSeoData(config, "home-page", data, url);
    default: return getSeoData(config, 'home-page', data, url);
  }
}

function getSeoDataFromCollection(config, data) {
  if (get(data, ["data", "collection", "name"])) {
    let { name, summary } = get(data, ["data", "collection"]);

    if (!summary) {
      summary = (getSeoData(config, 'home-page', data) || {}).description
    }

    return {
      'page-title': name,
      title: name,
      ogTitle: name,
      description: summary,
      ogDescription: summary,
      canonicalUrl: SKIP_CANONICAL
    }
  }
}

const SKIP_CANONICAL = '__SKIP__CANONICAL__'

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

  const ogUrl = seoData.ogUrl || seoData.canonicalUrl || currentUrl;
  const ogTags = seoConfig.enableOgTags ? {
    'og:type': pageType === 'story-page' ? 'article' : 'website',
    'og:url': ogUrl === SKIP_CANONICAL ? undefined : ogUrl,
    'og:title': seoData.ogTitle,
    'og:description': seoData.ogDescription
  } : undefined;

  const twitterTags = seoConfig.enableTwitterCards ? {
    'twitter:card': "summary_large_image",
    'twitter:title': seoData.title,
    'twitter:description': seoData.description,
  } : undefined;

  const allTags = Object.assign(basicTags, ogTags, twitterTags);

  const commonTags = [
    {tag: "title", children: data.title || seoData['page-title']},
  ];

  const canonical = seoData.canonicalUrl || currentUrl;
  if(canonical != SKIP_CANONICAL) {
    commonTags.push({ tag: "link", rel: "canonical", href: canonical});
  }

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
