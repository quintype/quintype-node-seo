import {omit, flatMap} from "lodash";
import React from "react";
import ReactDomServer from"react-dom/server";

import {TextTags} from './src/text-tags.js';
import {StaticTags} from './src/static-tags.js';
import {AuthorTags} from './src/author-tags.js';
import {ImageTags} from './src/image-tags.js';
import {StructuredDataTags} from './src/structured-data-tags.js';

export {TextTags, StaticTags, AuthorTags, ImageTags, StructuredDataTags};

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

export class SEO {
  constructor(seoConfig = {}) {
    this.seoConfig = seoConfig;
    this.generators = (seoConfig.generators || [TextTags, ImageTags, AuthorTags, StaticTags, StructuredDataTags]).concat(seoConfig.extraGenerators || []);
  }

  getMetaTags(config, pageType, data, params = {}) {
    return new MetaTagList(flatMap(this.generators, generator => generator(this.seoConfig, config, pageType, data, params)));
  }
}
