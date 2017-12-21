import {omit, flatMap, get} from "lodash";
import React from "react";
import ReactDomServer from"react-dom/server";

import {TextTags} from './src/text-tags.js';
import {StaticTags} from './src/static-tags.js';
import {AuthorTags} from './src/author-tags.js';
import {ImageTags} from './src/image-tags.js';
import {StructuredDataTags} from './src/structured-data-tags.js';
import {StoryAmpTags} from './src/amp-tags.js';

export {TextTags, StaticTags, AuthorTags, ImageTags, StructuredDataTags, StoryAmpTags};

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
    this.generators = (seoConfig.generators || [TextTags, ImageTags, AuthorTags, StaticTags, StructuredDataTags, StoryAmpTags]).concat(seoConfig.extraGenerators || []);
  }

  getMetaTags(config, pageType, data, params = {}) {
    pageType = get(this.seoConfig, ["pageTypeAliases", pageType], pageType);
    return new MetaTagList(flatMap(this.generators, generator => generator(this.seoConfig, config, pageType, data, params)));
  }
}
