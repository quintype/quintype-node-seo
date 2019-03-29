import {
  getSchemaContext,
  getSchemaType,
  getSchemaPerson,
  getSchemaBlogPosting,
  getSchemaPublisher,
  getSchemaMainEntityOfPage,
  getSchemaWebsite
} from './schema';

import get from "lodash/get";

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
  const storyUrl = `${publisherConfig['sketches-host']}/${story.slug}`;
  const mainEntityUrl = (Object.keys(story).length > 0 && structuredData.storyUrlAsMainEntityUrl) ? storyUrl : structuredData.organization.url;

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

function getCompleteText(story) {
  const textArray = []
  getTextElementsOfCards(story).forEach((item) => {
    textArray.push(item.text)
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
    "keywords": metaKeywords,
    "articleBody": (storyKeysPresence && getCompleteText(story)) || '',
    "dateCreated": stripMillisecondsFromTime(new Date(story['first-published-at'])),
    "dateModified": stripMillisecondsFromTime(new Date(story['last-published-at'])),
    "name": (storyKeysPresence && story.headline) || '',
    "image": generateArticleImageData(story['hero-image-s3-key'], publisherConfig)
  }, articleSectionObj(story));
}

function generateArticleImageData(image, publisherConfig) {
  const articleImage = imageUrl(publisherConfig, image);

  return Object.assign({}, {
    "@type": "ImageObject",
    "url": articleImage
  }, getQueryParams(articleImage))
}

function storyAccess(access) {
  if (access === null || access === "public") {
    return true;
  } else if (access === "subscription") {
    return false;
  }
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
    "isAccessibleForFree": storyAccessType
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
    "coverageEndTime": stripMillisecondsFromTime(new Date(story['updated-at'])),
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
    "keywords": metaKeywords,
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

export function StructuredDataTags({structuredData = {}}, config, pageType, response = {}, {url}) {
  const tags = [];
  const {story = {}} = response.data || {};
  const {config: publisherConfig = {}} = response;
  const {articleType = ''} = publisherConfig['publisher-settings'] || {};
  const isStructuredDataEmpty = Object.keys(structuredData).length === 0;
  let articleData = {};

  if(!isStructuredDataEmpty) {
    articleData = generateArticleData(structuredData, story, publisherConfig);
    tags.push(ldJson("Organization", structuredData.organization));
  }

  if(!isStructuredDataEmpty && pageType === 'home-page') {
    tags.push(ldJson("Website", Object.assign({}, generateWebSiteData(structuredData, story, publisherConfig))));
  }

  if(!isStructuredDataEmpty && pageType === 'story-page') {
    const newsArticleTags = generateNewsArticleTags();
    newsArticleTags ? tags.push(storyTags(), newsArticleTags) : tags.push(storyTags());
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

    return ldJson("Article", articleData);
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}