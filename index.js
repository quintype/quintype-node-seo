import {omit, flatMap} from "lodash";
import React from "react";
import ReactDomServer from"react-dom/server";

export * from './src/text-tags.js';
export * from './src/static-tags.js';

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

export function ImageTags(seoConfig, config, pageType, data, {url}) {
  // Story Pages have og:image, height, width
  // Story Pages have twitter:image
  return [];
}

export function AuthorTags(seoConfig, config, pageType, data, {url}) {
  // Story pages have creator
  return [];
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
