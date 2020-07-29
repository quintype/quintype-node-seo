import {get, isEmpty} from 'lodash';
import {objectToTags} from './utils';

function buildTagsFromStory(config, data, story, url = {}) {
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
  const customSeo = get(data,["data","customSeo"], {})
  const storyMetaData = {
    title: customSeo.title || seo["meta-title"] || story.headline,
    "page-title": customSeo.title || seo["meta-title"] || story.headline,
    description: customSeo.description || seo["meta-description"] || story.summary,
    keywords: customSeo.keywords || (seo["meta-keywords"] || (story.tags || []).map(tag => tag.name)).join(","),
    canonicalUrl: story["canonical-url"] || storyUrl,
    ogUrl: get(seo, ["og", "url"]) || storyUrl,
    ogTitle: customSeo.title || story.headline,
    ogDescription: customSeo.description || story.summary,
    storyUrl: storyUrl
  };

  if(url.query && url.query.cardId){
    const storyCardMetadata = getStoryCardMetadata(url.query.cardId);
    return Object.assign({}, storyMetaData, storyCardMetadata); //TODO rewrite in spread syntax, add babel plugin
  }
  return storyMetaData;
}

function buildTagsFromTopic(config, data, tag, url = {}) {
  if(isEmpty(tag))
    return;
  const customSeo = get(data,["data","customSeo"], {})
  const tagName = customSeo.title || tag.name;
  const tagDescription = customSeo.description || tag['meta-description'];
  const description = `Read stories listed under on ${tagName}`;
  const tagUrl = `${config['sketches-host']}${url.pathname}`
  const canonicalSlug = tag["canonical-slug"] || url.pathname;
  const canonicalUrl = `${config['sketches-host']}${canonicalSlug}`;
  const topicMetaData = {
    title: tagName,
    "page-title": tagName,
    description: tagDescription || description,
    keywords: tagName,
    canonicalUrl: canonicalUrl,
    ogUrl: tagUrl,
    ogTitle: tagName,
    ogDescription: tagDescription || description
  };

  return topicMetaData;
}

function buildTagsFromAuthor(config, data, author, url = {}) {
  if(isEmpty(author)) return;
  const customSeo = get(data,["data","customSeo"], {})
  const authorName = customSeo.title || author.name;
  const authorUrl = `${config['sketches-host']}${url.pathname}`;
  const description = customSeo.description || author.bio || `View all articles written by ${authorName}`;

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
    const customSeo = get(data,["data","customSeo"], {})
    if(seoMetadata.data || section.id) {
      const result = Object.assign({}, {
        'page-title': customSeo.title || section.name,
        title: customSeo.title || section.name,
        canonicalUrl: customSeo["section-url"] || section['section-url'] || undefined,
      }, seoMetadata.data);

      if(!result.description) {
        const homeSeoData = config['seo-metadata'].find(page => page['owner-type'] === 'home') || {data: {description: ""}};
        result.description = customSeo.description || homeSeoData.data.description;
      }

      result.ogTitle = customSeo.title || result.title;
      result.ogDescription = customSeo.description || result.description;
      return result;
    }
  }

  if(seoConfig.customTags && seoConfig.customTags[pageType]){
    return buildCustomTags(seoConfig.customTags, pageType);
  }
  switch(pageType) {
    case 'home-page': return findRelevantConfig('home')
    case 'section-page': return findRelevantConfig('section', get(data, ['data', 'section', 'id'])) || getSeoDataFromCollection(config, data) || getSeoData(config, 'home-page', data, url);
    case 'tag-page': return buildTagsFromTopic(config, data, get(data, ["data", "tag"]), url) || getSeoData(config, "home-page", data, url);
    case 'story-page': return buildTagsFromStory(config, data, get(data, ["data", "story"]), url) || getSeoData(config, "home-page", data, url);
    case 'visual-story': return buildTagsFromStory(config,data, get(data, ["story"]), url) || getSeoData(config, "home-page", data, url);
    case 'author-page': return buildTagsFromAuthor(config, data, get(data, ["data", "author"], {}), url) || getSeoData(config, "home-page", data, url);
    default: return getSeoData(config, 'home-page', data, url);
  }
}

function getSeoDataFromCollection(config, data) {
  if (get(data, ["data", "collection", "name"])) {
    let { name, summary } = get(data, ["data", "collection"]);
    const customSeo = get(data,["data","customSeo"], {})
    if (!summary) {
      summary = customSeo.description || (getSeoData(config, 'home-page', data) || {}).description
    }

    return {
      'page-title': customSeo.title || name,
      title: customSeo.title || name,
      ogTitle: customSeo.title || name,
      description: summary,
      ogDescription: summary,
      canonicalUrl: SKIP_CANONICAL
    }
  }
}

const SKIP_CANONICAL = '__SKIP__CANONICAL__'

/**
 * TextTags adds the majority of basic tags, such as
 * * Canonical URLs
 * * Title and Description
 * * Keywords
 *
 * If the current URL contains a cardId in the query parameters, then the title and description will come from *card["social-share"]*
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {boolean} seoConfig.enableOgTags Add og tags for Facebook
 * @param {boolean} seoConfig.enableTwitterCards Add twitter tags
 * @param {boolean} seoConfig.enableNews Add tags for Google News, like news_keywords
 * @param {Object} seoConfig.customTags Add tags for a custom page type. Usually looks like `{"custom-page": {"title": "value", "canonicalUrl": "value"}}`
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function TextTags(seoConfig, config, pageType, data, {url}) {
  const seoData = getSeoData(config, pageType, data, url, seoConfig);
  const customSeo = get(data,["data","customSeo"], {})
  if(!seoData)
    return [];

  const currentUrl = `${config['sketches-host']}${url.pathname}`;
  const basicTags = {
    'description': customSeo.description || seoData.description,
    'title': customSeo.title || seoData.title,
    'keywords': customSeo.keywords || seoData.keywords,
  };

  const ogUrl = seoData.ogUrl || seoData.canonicalUrl || currentUrl;
  const ogTags = seoConfig.enableOgTags ? {
    'og:type': pageType === 'story-page' || pageType === 'story-page-amp' ? 'article' : 'website',
    'og:url': ogUrl === SKIP_CANONICAL ? undefined : ogUrl,
    'og:title': customSeo.ogTitle || seoData.ogTitle,
    'og:description': customSeo.ogDescription || seoData.ogDescription
  } : undefined;

  const twitterTags = seoConfig.enableTwitterCards ? {
    'twitter:card': "summary_large_image",
    'twitter:title': customSeo.ogTitle || seoData.ogTitle,
    'twitter:description': customSeo.ogDescription || seoData.ogDescription
  } : undefined;

  const allTags = Object.assign(basicTags, ogTags, twitterTags);

  const commonTags = [
    {tag: "title", children: customSeo.title || data.title || seoData['page-title']},
  ];

  const canonical = seoData.canonicalUrl || currentUrl;
  if(canonical != SKIP_CANONICAL) {
    commonTags.push({ tag: "link", rel: "canonical", href: canonical});
  }

  if(pageType === 'story-page' || pageType === 'story-page-amp') {
    commonTags.push({name: "author", content: seoData.author});
  }

  if((pageType === 'story-page' || pageType === 'story-page-amp') && seoConfig.enableNews) {
    commonTags.push({name: "news_keywords", content: seoData.keywords});
    if(get(data, ["data", "story", "seo", "meta-google-news-standout"]))
      commonTags.push({tag: "link", rel: "standout", href: seoData.storyUrl || currentUrl});
  }

  return commonTags.concat(objectToTags(allTags));
}

export function getTitle(seoConfig, config, pageType, data, params) {
  const customSeo = get(data,["data","customSeo"], {})
  if(get(data, ["title"]))
    return customSeo.title || get(data, ["title"]);

  if(get(data, ["data", "title"]))
    return customSeo.title || get(data, ["data", "title"]);

  const seoData = getSeoData(config, pageType, data, undefined, seoConfig) || {};
  return customSeo.title || seoData['page-title'];
}
