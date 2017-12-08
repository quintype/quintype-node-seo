import {omit, entries, get, flatMap} from "lodash";
import React from "react";
import ReactDomServer from"react-dom/server";

function objectToTags(object) {
  return entries(object)
    .map(([key, value]) => ({[getPropertyName(key)]: key, content: value}));
}

function getPropertyName(key) {
  return (key.startsWith('fb:') || key.startsWith('og:')) ? 'property' : 'name';
}

export class MetaTagList {
  constructor(tags) {
    this.tags = tags;
  }

  toString() {
    return ReactDomServer.renderToStaticMarkup(this.tags.map(tag => React.createElement(tag.tag || "meta", omit(tag, "tag"))))
  }

  addTag() {
    return new MetaTagList(this.tags.concat([].slice.call(arguments)));
  }
}

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

export function ImageTags(seoConfig, config, pageType, data, {url}) {
  // Story Pages have og:image, height, width
  // Story Pages have twitter:image
  return [];
}

export function AuthorTags(seoConfig, config, pageType, data, {url}) {
  // Story pages have creator
  return [];
}

export function StaticTags(seoConfig, config, pageType, data, {url}) {
  return objectToTags(seoConfig.staticTags || {})
}

export function StructuredDataTags(seoConfig, config, pageType, data, {url}) {
  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return [];
}

export class SEO {
  constructor(seoConfig = {}) {
    this.seoConfig = seoConfig;
    this.generators = (seoConfig.generators || [TextTags, ImageTags, AuthorTags, StaticTags, StructuredDataTags]).concat(seoConfig.extraGenerators || []);
  }

  getMetaTags(config, pageType, data, params = {}) {
    return new MetaTagList(flatMap(this.generators, generator => generator(this.seoConfig, config, pageType, data, params)));
  }
}
