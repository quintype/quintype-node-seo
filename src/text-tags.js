import {get} from 'lodash';
import {objectToTags} from './utils';

function buildTagsFromStory(config, story) {
  if(!story)
    return;

  const seo = story.seo || {};

  const storyUrl = `${config['sketches-host']}/${story.slug}`;

  return {
    title: seo["meta-title"] || story.headline,
    "page-title": story.headline,
    description: seo["meta-description"] || story.summary,
    keywords: (seo["meta-keywords"] || (story.tags || []).map(tag => tag.name)).join(","),
    canonicalUrl: story["canonical-url"] || storyUrl,
    ogUrl: get(seo, ["og", "url"]) || storyUrl,
    storyUrl: storyUrl
  }
}

export function TextTags(seoConfig, config, pageType, data, {url}) {

  function getSeoData(pageType) {
    switch(pageType) {
      case 'home-page': return findRelevantConfig(page => page['owner-type'] === 'home')
      case 'section-page': return findRelevantConfig(page => page['owner-type'] === 'section' && page['owner-id'] === get(data, ['data', 'section', 'id'])) || getSeoData('home-page');
      case 'story-page': return buildTagsFromStory(config, get(data, ["data", "story"])) || getSeoData("home");
      default: return getSeoData('home-page');
    }
  }

  function findRelevantConfig(pred) {
    const seoMetadata = config['seo-metadata'].find(pred) || {};
    return seoMetadata.data;
  }

  const seoData = getSeoData(pageType);

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
