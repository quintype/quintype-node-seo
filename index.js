import { flatMap, get, omit, uniqBy } from "lodash";
import React from "react";
import ReactDomServer from "react-dom/server";
import { StoryAmpTags } from './src/amp-tags.js';
import { AuthorTags } from './src/author-tags.js';
import { generateStaticData, generateStructuredData } from './src/generate-common-seo';
import { ImageTags } from './src/image-tags.js';
import { StaticTags } from './src/static-tags.js';
import { StructuredDataTags } from './src/structured-data/structured-data-tags.js';
import { getTitle, TextTags } from './src/text-tags.js';


export { TextTags, StaticTags, AuthorTags, ImageTags, StructuredDataTags, StoryAmpTags, generateStaticData, generateStructuredData };

function tagToKey(tag) {
  switch (tag.tag || "meta") {
    case "meta": return `meta-${tag.name || tag.itemprop || "name"}-${tag.property || "property"}`;
    case "link": return `link-${tag.rel}`;
    case "title": return `title`;
    default: return Math.random().toString();
  }
}

export class MetaTagList {
  constructor(tags) {
    this.tags = tags;
  }

  toString() {
    const uniqueTags = uniqBy(this.tags.reverse(), tagToKey).reverse();
    return ReactDomServer.renderToStaticMarkup(uniqueTags.map(tag => React.createElement(tag.tag || "meta", omit(tag, "tag"))));
  }

  addTag() {
    return new MetaTagList(this.tags.concat([].slice.call(arguments)));
  }
}

/**
 * This class represents the SEO tag generator, and is the main export from this library.
 *
 * The SEO class works by passing the data related to the current page through a series of {@link Generator}s, which take data and return a series of tags.
 *
 * By default, the following generators are included:
 * * {@link TextTags}
 * * {@link ImageTags}
 * * {@link AuthorTags}
 * * {@link StaticTags}
 * * {@link StructuredDataTags}
 * * {@link StoryAmpTags}
 *
 * This library should already be installed in the malibu app generator, and an example can be found in there.
 *
 * ```javascript
 * new SEO({
 *   staticTags: {
 *     "twitter:site": "Quintype",
 *     "twitter:domain": "quintype.com",
 *     "twitter:app:name:ipad": "Quintype",
 *     "twitter:app:name:googleplay": "Quintype (Official App)",
 *     "twitter:app:id:googleplay": "com.quintype",
 *     "twitter:app:name:iphone": "Quintype for iPhone",
 *     "twitter:app:id:iphone": "42",
 *     "apple-itunes-app": "app-id=42",
 *     "google-play-app": "app-id=com.quintype",
 *     "fb:app_id": "42",
 *     "fb:pages": "42",
 *     "og:site_name": "Quintype"
 *   },
 *   enableTwitterCards: true,
 *   enableOgTags: true,
 *   enableNews: true,
 *   structuredData: {
 *     organization: {
 *       name: "Quintype",
 *       url: "http://www.quintype.com/",
 *       logo: "https://quintype.com/logo.png",
 *       sameAs: ["https://www.facebook.com/quintype","https://twitter.com/quintype_in","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],
 *     },
 *     enableNewsArticle: true
 *   },
 *   ampStoryPages: true
 * });
 * ```
 */
export class SEO {
  /**
   * Create a new SEO Object
   * @param {Object} seoConfig Configuration that is passed as the first argument to each {@link Generator}
   * @param {Array<Generator>} seoConfig.generators List of generators to run (optional)
   * @param {Array<Generator>} seoConfig.extraGenerators List of generators to run after the main generators run. Generators here can override tags that are returned by earlier generator. See [Custom SEO Malibu Tutorial](https://developers.quintype.com/malibu/tutorial/custom-seo).
   * @param {Object} seoConfig.pageTypeAliases A map of aliases to their original page type. This is a convenience if you want to have a different page type for some sections. ex: `{"budget-page":"section-page"}`
   */
  constructor(seoConfig = {}) {
    this.seoConfig = seoConfig;
    this.generators = (seoConfig.generators || [TextTags, ImageTags, AuthorTags, StaticTags, StructuredDataTags, StoryAmpTags]).concat(seoConfig.extraGenerators || []);
  }

  getMetaTags(config, pageType, data, params = {}) {
    pageType = get(this.seoConfig, ["pageTypeAliases", pageType], pageType);
    return new MetaTagList(flatMap(this.generators, generator => generator(this.seoConfig, config, pageType, data, params)));
  }

  getTitle(config, pageType, data, params = {}) {
    return getTitle(this.seoConfig, config, pageType, data, params);
  }
}
