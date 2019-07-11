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
    "articleBody": (storyKeysPresence && getCompleteText(story, structuredData.stripHtmlFromArticleBody)) || '',
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

function generateBreadcrumbListData(pageType = "", config = {}, data = {}) {
  const { "sketches-host": domain, sections } = config;
  const breadcrumbList = getSchemaBreadcrumbList();
  breadcrumbList.itemListElement.push(getSchemaListItem(1, "Home", domain));

  function addCrumb(crumbsList, currentSection, itemListOrder) {
    const parentSection = sections.filter(section => section.id === currentSection["parent-id"])[0];

    if(!parentSection) return crumbsList;

    const { name, slug } = parentSection;
    const url = `${domain}/${slug}`;
    crumbsList.push(getSchemaListItem(itemListOrder, name, url));
    return addCrumb(crumbsList, parentSection, ++itemListOrder);
  }

  function getSectionPageCrumbs({ slug = "", name = "" }) {
    const url = `${domain}/${slug}`;
    const crumbsList = [getSchemaListItem(2, name, url)];
    const currentSection = sections.filter(section => section.slug === slug)[0];
    return addCrumb(crumbsList, currentSection, 3);
  }

  function getCollectionPageCrumbs({ slug = "", name = "" }) {
    const url = `${domain}/collection/${slug}`;
    return getSchemaListItem(2, name, url);
  }

  function getStoryPageCrumbs({ slug = "", headline = "", sections: storySections = [] }) {
    const currentSection = sections.filter(section => section.slug === storySections[0]["slug"])[0];
    const sectionCrumbsList = getSectionPageSchema(currentSection);
    const position = sectionCrumbsList.length + 2;
    const url = `${domain}/${slug}`;
    sectionCrumbsList.push(getSchemaListItem(position, headline, url));
    return sectionCrumbsList;
  }

  switch (pageType) {
    case "section-page": breadcrumbList.itemListElement = breadcrumbList.itemListElement.concat(getSectionPageCrumbs(data.section)); break;
    case "collection-page": breadcrumbList.itemListElement.push(getCollectionPageCrumbs(data.collection)); break;
    case "story-page": breadcrumbList.itemListElement = breadcrumbList.itemListElement.concat(getStoryPageCrumbs(data.story)); break;
  }
  return breadcrumbList;
}

export function StructuredDataTags({structuredData = {}}, config, pageType, response = {}, {url}) {
  const tags = [];
  const {story = {}} = response.data || {};
  const entities = get (response, ["data", "linkedEntities"], null) || [];
  const {config: publisherConfig = {}} = response;
  const {articleType = ''} = publisherConfig['publisher-settings'] || {};
  const isStructuredDataEmpty = Object.keys(structuredData).length === 0;
  let articleData = {};

  if(!isStructuredDataEmpty) {
    articleData = generateArticleData(structuredData, story, publisherConfig);
  }

  if(!isStructuredDataEmpty && pageType === 'home-page') {
    tags.push(ldJson("Organization", structuredData.organization));
    tags.push(ldJson("Website", Object.assign({}, generateWebSiteData(structuredData, story, publisherConfig))));
  }

  if(!isStructuredDataEmpty && structuredData.enableBreadcrumbList) {
    tags.push(ldJson("BreadcrumbList", generateBreadcrumbListData(pageType, config.config, response.data)));
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
