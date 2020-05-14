import {
  getSchemaContext,
  getSchemaType,
  getSchemaPerson,
  getSchemaFooter,
  getSchemaHeader,
  getSchemaBlogPosting,
  getSchemaPublisher,
  getSchemaMainEntityOfPage,
  getSchemaWebsite,
  getSchemaBreadcrumbList,
  getSchemaListItem
} from './schema';
import get from "lodash/get";
import { generateTagsForEntity } from './entity';

import { stripMillisecondsFromTime, getQueryParams } from "../utils";
import { generateImageObject } from '../generate-common-seo';

function getLdJsonFields(type, fields) {
  return Object.assign({}, fields, getSchemaType(type), getSchemaContext);
}

function ldJson(type, fields) {
  const json = JSON.stringify(getLdJsonFields(type, fields))
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    tag: "script",
    type: "application/ld+json",
    dangerouslySetInnerHTML: {__html: json}
  };
}

function imageUrl(publisherConfig, s3Key) {
  const imageSrc = /^https?.*/.test(publisherConfig['cdn-image']) ? publisherConfig['cdn-image'] : `https://${publisherConfig['cdn-image']}`;
  return `${imageSrc}/${s3Key}?w=480&h=270&auto=format%2Ccompress&fit=max`;
}

function generateCommonData(structuredData = {}, story = {}, publisherConfig = {}) {
  const storyUrl = story.url || `${publisherConfig['sketches-host']}/${story.slug}`;
  const mainEntityUrl = (Object.keys(story).length > 0 && structuredData.storyUrlAsMainEntityUrl) ? storyUrl : get(structuredData, ['organization', 'url'], '');

  return Object.assign({},
    {'headline' : story.headline,
    "image": [imageUrl(publisherConfig, story['hero-image-s3-key'])],
    "url": `${publisherConfig['sketches-host']}/${story.slug}`,
    "datePublished": stripMillisecondsFromTime(new Date(story['first-published-at']))},
    getSchemaMainEntityOfPage(mainEntityUrl),
    getSchemaPublisher(structuredData.organization)
  )
}

function authorData(authors) {
  return (authors || []).map(author => getSchemaPerson(author.name));
}

function getTextElementsOfCards(story) {
  if(story && story.cards) {
    return story.cards.reduce((acc, currentCard) => {
      return acc.concat(currentCard['story-elements'].filter(element => element.type === 'text'));
    }, []);
  }
}

function getPlainText(text = '') {
  return text.replace(/<[^>]+>/g, '');
}

function getCompleteText(story, stripHtmlFromArticleBody) {
  const textArray = []
  getTextElementsOfCards(story).forEach((item) => {
    const textContent = stripHtmlFromArticleBody ? getPlainText(item.text) : item.text;
    textArray.push(textContent)
  })
  const completeCardText = textArray.join('.');
  return completeCardText;
}

function articleSectionObj(story) {
  if(story['story-template'] !== 'video') {
    return { 'articleSection': get(story, ['sections', '0', 'display-name'], '') }
  }
}

function generateArticleData (structuredData = {}, story = {}, publisherConfig = {}){
  const metaKeywords = story.seo && story.seo['meta-keywords'] || [];
  const authors = story.authors && story.authors.length !== 0 ? story.authors : [{name: story["author-name"] || ""}];
  const storyKeysPresence = Object.keys(story).length > 0;

  return Object.assign({}, generateCommonData(structuredData, story, publisherConfig), {
    "author": authorData(authors),
    "keywords": metaKeywords.join(','),
    "thumbnailUrl": imageUrl(publisherConfig, story['hero-image-s3-key']),
    "articleBody": (storyKeysPresence && getCompleteText(story, structuredData.stripHtmlFromArticleBody)) || '',
    "dateCreated": stripMillisecondsFromTime(new Date(story['first-published-at'])),
    "dateModified": stripMillisecondsFromTime(new Date(story['last-published-at'])),
    "name": (storyKeysPresence && story.headline) || '',
    "image": generateArticleImageData(story['hero-image-s3-key'], publisherConfig),
    isPartOf: generateIsPartOfData(story, publisherConfig)
  }, articleSectionObj(story));
}

function generateArticleImageData(image, publisherConfig = {}) {
  const articleImage = imageUrl(publisherConfig, image);

  return Object.assign({}, {
    "@type": "ImageObject",
    "url": articleImage
  }, getQueryParams(articleImage))
}

function storyAccess(access) {
  if (access === null || access === "public" || access === "login") {
    return true;
  } else if (access === "subscription" ) {
    return false;
  }
}

function generateIsPartOfData(story = {}, publisherConfig = {}) {
  return Object.assign(
    {},
    {
      "@type": "WebPage",
      url: `${publisherConfig["sketches-host"]}/${story.slug}`,
      primaryImageOfPage: generateArticleImageData(
        story["hero-image-s3-key"],
        publisherConfig
      )
    }
  );
}

function generateHasPartData(storyAccess) {
  return storyAccess ?
    {} :
    {"hasPart": [
      {
        "@type": "WebPageElement",
        "isAccessibleForFree": storyAccess,
          "cssSelector": ".paywall"
      }
    ]
  }
}

function generateNewsArticleData (structuredData = {}, story = {}, publisherConfig = {}) {
  const {alternative = {}} = story.alternative || {};
  const storyAccessType = storyAccess(story['access']);
  return Object.assign({}, {
    "alternativeHeadline": (alternative.home && alternative.home.default) ? alternative.home.default.headline : "",
    "description": story.summary,
    "isAccessibleForFree": storyAccessType,
    isPartOf: generateIsPartOfData(story, publisherConfig)
  }, generateHasPartData(storyAccessType));
}

function findStoryElementField(card, type, field, defaultValue) {
  const elements = card['story-elements'].filter(e => e.type == type || e.subtype == type);
  if(elements.length > 0)
    return elements[0][field];
  else
    return defaultValue;
}

function generateLiveBlogPostingData (structuredData = {}, story = {}, publisherConfig = {}){
  return {
    "coverageEndTime": stripMillisecondsFromTime(new Date(story['last-published-at'])),
    "coverageStartTime": stripMillisecondsFromTime(new Date(story['first-published-at'])),
    "liveBlogUpdate": story.cards.map(card =>
      getSchemaBlogPosting(card,
        authorData(story.authors),
        findStoryElementField(card, "title", "text", story.headline),
        imageUrl(publisherConfig, findStoryElementField(card, "image", "image-s3-key", story['hero-image-s3-key'])),
        structuredData,
        story
      )
    )
  };
}

function generateVideoArticleData (structuredData = {}, story = {}, publisherConfig = {}) {
  const metaKeywords = story.seo && story.seo['meta-keywords'] || [];
  const articleSection = get(story, ['sections', '0', 'display-name'], '');
  const embedUrl = get(story, ['cards', '0', 'story-elements', '0', 'embed-url'], '');

  return Object.assign({}, generateCommonData(structuredData, story, publisherConfig), {
    "author": authorData(story.authors),
    "keywords": metaKeywords.join(','),
    "dateCreated": stripMillisecondsFromTime(new Date(story['first-published-at'])),
    "dateModified": stripMillisecondsFromTime(new Date(story['last-published-at'])),
    "description": story.summary,
    "name": story.headline,
    "thumbnailUrl": [imageUrl(publisherConfig, story['hero-image-s3-key'])],
    "uploadDate": stripMillisecondsFromTime(new Date(story['last-published-at'])),
    "embedUrl": embedUrl
  });
}

function generateWebSiteData(structuredData = {}, story = {}, publisherConfig = {}) {
  return getSchemaWebsite(structuredData.website);
}

function generateBreadcrumbListData(pageType = "", publisherConfig = {}, data = {}) {
  const { "sketches-host": domain = "", sections = [] } = publisherConfig;
  let breadcrumbsDataList = [{ name: "Home", url: domain }];

  function addCrumb(crumbsDataList = [], currentSection = {}) {
    if(!currentSection["parent-id"]) return crumbsDataList;

    const parentSection = sections.find(section => section.id === currentSection["parent-id"]);

    if(!parentSection) return crumbsDataList;

    const { "section-url":url = "", name = "" } = parentSection;
    crumbsDataList.unshift({ url, name });
    return addCrumb(crumbsDataList, parentSection);
  }

  function getSectionPageCrumbs(section = {}) {
    const { "section-url":url = "", name = "" } = section;
    const crumbsDataList = [{ url, name }];
    return addCrumb(crumbsDataList, section);
  }

  function getStoryPageCrumbs({ headline = "", url = "", sections: [storySection] } = {}) {
    let sectionCrumbsDataList = [];
    if(storySection) {
      sectionCrumbsDataList = getSectionPageCrumbs(storySection);
    }
    sectionCrumbsDataList.push({ name:headline, url});
    return sectionCrumbsDataList;
  }

  function getBreadCrumbs(breadcrumb = {}) {
    const crumbsDataList = [{ url: breadcrumb.url, name: breadcrumb.name}];
    return addCrumb(crumbsDataList);
  }

  if(data.breadcrumbs && ("name" in data.breadcrumbs) && ("url" in data.breadcrumbs)) {
    breadcrumbsDataList = breadcrumbsDataList.concat(getBreadCrumbs(data.breadcrumbs));
    return getSchemaBreadcrumbList(breadcrumbsDataList);
  }
  switch (pageType) {
    case "section-page": breadcrumbsDataList = breadcrumbsDataList.concat(getSectionPageCrumbs(data.section)); break;
    case "story-page": breadcrumbsDataList = breadcrumbsDataList.concat(getStoryPageCrumbs(data.story)); break;
  }
  return getSchemaBreadcrumbList(breadcrumbsDataList);
}

/**
 * Options for a schema.org Organization
 * Example
 * ```javascript
 * {
 *   name: "Quintype",
 *   url: "http://www.quintype.com/",
 *   logo: "https://quintype.com/logo.png",
 *   sameAs: ["https://www.facebook.com/quintype","https://twitter.com/quintype_in","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"]
 * }
 * ```
 * @typedef Organization
 */

/**
* Options for a schema.org Website
* Example
* ```javascript
* {
*   url: 'https://www.quintype.com/',
*   searchpath: 'search?q={q}',
*   queryinput: 'required name=q',
*   name: 'Quintype',
*   headline: 'Quintype - Discover news',
*   keywords: 'news,quintype'
* }
* ```
* @typedef Website
*/

/**
 * Options to {@link StructuredDataTags}
 *
 * @typedef StructuredDataConfig
 * @property {boolean} enableBreadcrumbList Should breadcrumbs be enabled (default true)
 * @property {boolean} enableLiveBlog Should LiveBlog schema be implemented for live blogs (default false)
 * @property {boolean} enableVideo Should VideoObject be enabled for video stories (default false)
 * @property {(boolean | "withoutArticleSchema")} enableNewsArticle If set to true, then both Article and NewsArticle schema are implemented. If set to *"withoutArticleSchema"*, then only NewsArticle is implemented
 * @property {Organization} organization The organization to put on the homepage. See {@link Organization} for an example
 * @property {Website} website The website and search urls. See {@link Website} for an example
 * @property {Object} header Enable WPHeader tag. ex: `{cssSelector: ".header"}`
 * @property {Object} footer Enable WPFooter tag. ex: `{cssSelector: ".footer"}`
 * @property {Array} structuredDataTags An array of tags describing the publisher. eg: `{structuredDataTags: ["section-page", "tag-page"]}`
 * 
 */

/**
 * StructuredData adds tags for schema.org's structured data
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {StructuredDataConfig} seoConfig.structuredData Please see {@link StructuredDataConfig} for a full list of supported options
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function StructuredDataTags({structuredData = {}}, config, pageType, response = {}, {url}) {
  const tags = [];
  const {story = {}} = response.data || {};
  const entities = get (response, ["data", "linkedEntities"], null) || [];
  const {config: publisherConfig = {}} = response;
  const {articleType = ''} = publisherConfig['publisher-settings'] || {};
  const isStructuredDataEmpty = Object.keys(structuredData).length === 0;
  const enableBreadcrumbList = get(structuredData, ["enableBreadcrumbList"], true);
  const structuredDataTags = get(structuredData, ["structuredDataTags"], []);

  let articleData = {};

  if(!isStructuredDataEmpty) {
    articleData = generateArticleData(structuredData, story, publisherConfig);
    structuredDataTags.map((type)=> {
      if(pageType === type) {
        tags.push(ldJson("Organization", structuredData.organization));
        if (structuredData.website) {
          tags.push(ldJson("Website", Object.assign({}, generateWebSiteData(structuredData, story, publisherConfig))));
        }
      }
    })
  }

  if(!isStructuredDataEmpty && pageType === 'home-page') {
    tags.push(ldJson("Organization", structuredData.organization));
    if(structuredData.website)  {
      tags.push(ldJson("Website", Object.assign({}, generateWebSiteData(structuredData, story, publisherConfig))));
    }
  }

  if(!isStructuredDataEmpty && enableBreadcrumbList) {
    tags.push(ldJson("BreadcrumbList", generateBreadcrumbListData(pageType, publisherConfig, response.data)));
  }

  if(!isStructuredDataEmpty && pageType === 'story-page') {
    const newsArticleTags = generateNewsArticleTags();
    newsArticleTags ? tags.push(storyTags(), newsArticleTags) : tags.push(storyTags());
  }

  if(!isStructuredDataEmpty && structuredData.header) {
    tags.push(ldJson("WPHeader", getSchemaHeader(structuredData.header)));
  }

  if(!isStructuredDataEmpty && structuredData.footer) {
    tags.push(ldJson("WPFooter",getSchemaFooter(structuredData.footer)));
  }

  if (entities.length> 0 ) {
    for ( let entity of entities) {
      const entityTags = generateTagsForEntity(entity, ldJson);
      entityTags && tags.push(entityTags);
    }
  }

  function generateNewsArticleTags() {
    if(structuredData.enableNewsArticle) {
      return ldJson('NewsArticle', Object.assign({}, articleData, generateNewsArticleData(structuredData, story, publisherConfig)))
    }
  }

  function storyTags() {
    if(structuredData.enableLiveBlog && story['story-template'] === 'live-blog') {
      return ldJson("LiveBlogPosting", Object.assign({}, generateLiveBlogPostingData(structuredData, story, publisherConfig)))
    }

    if(structuredData.enableVideo && story['story-template'] === 'video') {
      return ldJson("VideoObject", generateVideoArticleData(structuredData, story, publisherConfig))
    }

    if(structuredData.enableNewsArticle !== 'withoutArticleSchema') {
      return ldJson("Article", articleData);
    }
    return {}
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}
