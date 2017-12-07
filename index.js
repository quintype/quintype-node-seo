import {omit, entries} from "lodash";
import React from "react";
import ReactDomServer from"react-dom/server";

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

export function BasicTags(seoConfig, config, pageType, data) {
  // All pages have title, and description
  // Specific Pages:
  // Home and Section have keywords
  // Stories have Canonical, Keywords and News Keywords
  return [];
}

export function OgTags(seoConfig, config, pageType, data) {
  // All pages have og:type, og:url, og:title, og:description
  // Story Pages have og:image, height, width
  return [];
}

export function TwitterTags(seoConfig, config, pageType, data) {
  // All stories have card, title, description, image
  // Story pages have creator
  return [];
}

export function StaticTags(seoConfig, config, pageType, data) {
  return entries(seoConfig.staticTags || {})
    .map(([key, value]) => ({[getPropertyName(key)]: key, content: value}));
}

export function StructuredDataTags(seoConfig, config, pageType, data) {
  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return [];
}

function getPropertyName(key) {
  return (key.startsWith('fb:') || key.startsWith('og:')) ? 'property' : 'name';
}

export class SEO {
  constructor(seoConfig = {}) {
    this.seoConfig = seoConfig;
    this.generators = (seoConfig.generators || [BasicTags, OgTags, TwitterTags, StaticTags, StructuredDataTags]).concat(seoConfig.extraGenerators || []);
  }

  getMetaTags(config, pageType, data) {
    return Promise.all(this.generators.map(generator => Promise.resolve(generator(this.seoConfig, config, pageType, data))))
      .then(listOfListofTags => new MetaTagList([].concat.apply([], listOfListofTags)));
  }
}
