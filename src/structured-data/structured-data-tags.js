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
  getSchemaListItem,
} from './schema';
import get from 'lodash/get';
import {generateTagsForEntity} from './entity';

import {stripMillisecondsFromTime, getQueryParams} from '../utils';
import {generateImageObject} from '../generate-common-seo';

function getLdJsonFields(type, fields) {
  return Object.assign({}, fields, getSchemaType(type), getSchemaContext);
}

function ldJson(type, fields) {
  const json = JSON.stringify(getLdJsonFields(type, fields))
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return {
    tag: 'script',
    type: 'application/ld+json',
    dangerouslySetInnerHTML: {__html: json},
  };
}

function imageUrl(publisherConfig, s3Key, width, height) {
  const imageSrc = /^https?.*/.test(publisherConfig['cdn-image'])
    ? publisherConfig['cdn-image']
    : `https://${publisherConfig['cdn-image']}`;
  width = width || '';
  height = height || '';
  return `${imageSrc}/${s3Key}?w=${width}&h=${height}&auto=format%2Ccompress&fit=max`;
}

function generateCommonData(
  structuredData = {},
  story = {},
  publisherConfig = {},
  pageType = '',
  timezone
) {
  const storyUrl =
    story.url || `${publisherConfig['sketches-host']}/${story.slug}`;
  const mainEntityUrl =
    Object.keys(story).length > 0 && structuredData.storyUrlAsMainEntityUrl
      ? storyUrl
      : get(structuredData, ['organization', 'url'], '');
  const imageWidth = pageType === 'story-page-amp' ? '1200' : '480';
  const imageHeight = pageType === 'story-page-amp' ? '750' : '270';
  return Object.assign(
    {},
    {
      headline: story.headline,
      image: [
        imageUrl(
          publisherConfig,
          story['hero-image-s3-key'],
          imageWidth,
          imageHeight
        ),
      ],
      url: `${publisherConfig['sketches-host']}/${story.slug}`,
      datePublished: stripMillisecondsFromTime(
        new Date(story['first-published-at']), timezone
      ),
    },
    getSchemaMainEntityOfPage(mainEntityUrl),
    getSchemaPublisher(structuredData.organization)
  );
}

function authorData(authors) {
  return (authors || []).map(author => getSchemaPerson(author.name));
}

function getTextElementsOfCards(story) {
  if (story && story.cards) {
    return story.cards.reduce((acc, currentCard) => {
      return acc.concat(
        currentCard['story-elements'].filter(element => element.type === 'text')
      );
    }, []);
  }
}

function getPlainText(text = '') {
  return text.replace(/<[^>]+>/g, '');
}

function getCompleteText(story, stripHtmlFromArticleBody) {
  const textArray = [];
  getTextElementsOfCards(story).forEach(item => {
    const textContent = stripHtmlFromArticleBody
      ? getPlainText(item.text)
      : item.text;
    textArray.push(textContent);
  });
  const completeCardText = textArray.join('.');
  return completeCardText;
}

function articleSectionObj(story) {
  if (story['story-template'] !== 'video') {
    return {articleSection: get(story, ['sections', '0', 'display-name'], '')};
  }
}

function generateArticleData(
  structuredData = {},
  story = {},
  publisherConfig = {},
  pageType = '',
  timezone
) {
  const metaKeywords = (story.seo && story.seo['meta-keywords']) || [];
  const authors =
    story.authors && story.authors.length !== 0
      ? story.authors
      : [{name: story['author-name'] || ''}];
  const storyKeysPresence = Object.keys(story).length > 0;
  const imageWidth = pageType === 'story-page-amp' ? '1200' : '480';
  const imageHeight = pageType === 'story-page-amp' ? '750' : '270';
  const storyAccessType = storyAccess(story['access']);
  return Object.assign(
    {},
    generateCommonData(structuredData, story, publisherConfig, pageType, timezone),
    {
      author: authorData(authors),
      keywords: metaKeywords.join(','),
      thumbnailUrl: imageUrl(
        publisherConfig,
        story['hero-image-s3-key'],
        imageWidth,
        imageHeight
      ),
      articleBody:
        (storyKeysPresence &&
          getCompleteText(story, structuredData.stripHtmlFromArticleBody)) ||
        '',
      dateCreated: stripMillisecondsFromTime(
        new Date(story['first-published-at']), timezone
      ),
      dateModified: stripMillisecondsFromTime(
        new Date(story['last-published-at']), timezone
      ),
      name: (storyKeysPresence && story.headline) || '',
      image: generateArticleImageData(
        story['hero-image-s3-key'],
        publisherConfig,
        pageType
      ),
      isAccessibleForFree: storyAccessType,
      isPartOf: generateIsPartOfDataForArticle(story, publisherConfig, pageType),
    },
    articleSectionObj(story)
  );
}

function generateArticleImageData(image, publisherConfig = {}, pageType = '') {
  const imageWidth = pageType === 'story-page-amp' ? '1200' : '480';
  const imageHeight = pageType === 'story-page-amp' ? '750' : '270';
  const articleImage = imageUrl(
    publisherConfig,
    image,
    imageWidth,
    imageHeight
  );

  return Object.assign(
    {},
    {
      '@type': 'ImageObject',
      url: articleImage,
    },
    getQueryParams(articleImage)
  );
}

function storyAccess(access) {
  if (access === null || access === 'public' || access === 'login') {
    return true;
  } else if (access === 'subscription') {
    return false;
  }
}

function generateIsPartOfDataForArticle(story = {}, publisherConfig = {}, pageType = '') {
  return Object.assign(
        {},
        {
          '@type': 'WebPage',
          url: `${publisherConfig['sketches-host']}/${story.slug}`,
          primaryImageOfPage: generateArticleImageData(
            story['hero-image-s3-key'],
            publisherConfig,
            pageType
          ),
        }
      );
}

function generateIsPartOfDataForNewsArticle(story ={}, publisherConfig = {}, pageType = '', structuredData = {}) {
  const publisherName = publisherConfig['publisher-name'];
  const productId = publisherConfig['publisher-name'] + '.com:basic';
  const isPartOfData = generateIsPartOfDataForArticle(story, publisherConfig, pageType);

  if(pageType === 'story-page-amp' && structuredData.isAmpSubscriptionsEnabled) {
    return Object.assign(
      {},
      {
        '@type': ['WebPage', 'CreativeWork', 'Product'],
        name: publisherName,
        productID: productId,
        url: `${publisherConfig['sketches-host']}/${story.slug}`,
        primaryImageOfPage: generateArticleImageData(
          story['hero-image-s3-key'],
          publisherConfig,
          pageType
        ),
      }
    )
  }
  return isPartOfData
}

function generateHasPartData(storyAccess) {
  return storyAccess
    ? {}
    : {
        hasPart: [
          {
            '@type': 'WebPageElement',
            isAccessibleForFree: storyAccess,
            cssSelector: '.paywall',
          },
        ],
      };
}

function generateNewsArticleData(
  structuredData = {},
  story = {},
  publisherConfig = {},
  pageType = ''
) {
  const {alternative = {}} = story.alternative || {};
  const storyAccessType = storyAccess(story['access']);
  return Object.assign(
    {},
    {
      alternativeHeadline:
        alternative.home && alternative.home.default
          ? alternative.home.default.headline
          : '',
      description: story.summary,
      isAccessibleForFree: storyAccessType,
      isPartOf: generateIsPartOfDataForNewsArticle(story, publisherConfig, pageType, structuredData),
    },
    generateHasPartData(storyAccessType)
  );
}

function findStoryElementField(card, type, field, defaultValue) {
  const elements = card['story-elements'].filter(
    e => e.type == type || e.subtype == type
  );
  if (elements.length > 0) return elements[0][field];
  else return defaultValue;
}

function generateLiveBlogPostingData(
  structuredData = {},
  story = {},
  publisherConfig = {},
  pageType,
  timezone
) {
  const imageWidth = pageType === 'story-page-amp' ? '1200' : '480';
  const imageHeight = pageType === 'story-page-amp' ? '750' : '270';
  return {
    headline: story.headline,
    description: story.summary || story.headline,
    author: story['author-name'],
    coverageEndTime: stripMillisecondsFromTime(
      new Date(story['last-published-at']), timezone
    ),
    coverageStartTime: stripMillisecondsFromTime(
      new Date(story['first-published-at']), timezone
    ),
    dateModified: stripMillisecondsFromTime(
      new Date(story['last-published-at']), timezone
    ),
    liveBlogUpdate: story.cards.map(card =>
      getSchemaBlogPosting(
        card,
        authorData(story.authors),
        findStoryElementField(card, 'title', 'text', story.headline),
        imageUrl(
          publisherConfig,
          findStoryElementField(
            card,
            'image',
            'image-s3-key',
            story['hero-image-s3-key']
          ),
          imageWidth,
          imageHeight
        ),
        structuredData,
        story,
        timezone
      )
    ),
  };
}

function generateVideoArticleData(
  structuredData = {},
  story = {},
  publisherConfig = {},
  pageType = '',
  timezone
) {
  const metaKeywords = (story.seo && story.seo['meta-keywords']) || [];
  const articleSection = get(story, ['sections', '0', 'display-name'], '');
  const embedUrl = get(
    story,
    ['cards', '0', 'story-elements', '0', 'embed-url'],
    ''
  );
  const socialShareMsg = get(story, ['summary'], '');
  const metaDescription = get(story, ['seo', 'meta-description'], '');
  const subHeadline = get(story, ['subheadline'], '');
  const headline = get(story, ['headline'], '');
  const imageWidth = pageType === 'story-page-amp' ? '1200' : '480';
  const imageHeight = pageType === 'story-page-amp' ? '750' : '270';
  return Object.assign(
    {},
    generateCommonData(structuredData, story, publisherConfig, pageType, timezone),
    {
      author: authorData(story.authors),
      keywords: metaKeywords.join(','),
      dateCreated: stripMillisecondsFromTime(
        new Date(story['first-published-at']), timezone
      ),
      dateModified: stripMillisecondsFromTime(
        new Date(story['last-published-at']), timezone
      ),
      description: socialShareMsg || metaDescription || subHeadline || headline,
      name: story.headline,
      thumbnailUrl: [
        imageUrl(
          publisherConfig,
          story['hero-image-s3-key'],
          imageWidth,
          imageHeight
        ),
      ],
      uploadDate: stripMillisecondsFromTime(
        new Date(story['last-published-at']), timezone
      ),
      embedUrl: embedUrl,
    }
  );
}

function generateWebSiteData(
  structuredData = {},
  story = {},
  publisherConfig = {}
) {
  return getSchemaWebsite(structuredData.website);
}

function generateBreadcrumbListData(
  pageType = '',
  publisherConfig = {},
  data = {}
) {
  const {'sketches-host': domain = '', sections = []} = publisherConfig;
  let breadcrumbsDataList = [{name: 'Home', url: domain}];
  function addCrumb(crumbsDataList = [], currentSection = {}) {
    if (!currentSection['parent-id']) return crumbsDataList;

    const parentSection = sections.find(
      section => section.id === currentSection['parent-id']
    );

    if (!parentSection) return crumbsDataList;

    const {'section-url': url = '', name = ''} = parentSection;
    crumbsDataList.unshift({url, name});
    return addCrumb(crumbsDataList, parentSection);
  }

  function getSectionPageCrumbs(section = {}) {
    const {'section-url': url = '', name = ''} = section;
    const crumbsDataList = [{url, name}];
    return addCrumb(crumbsDataList, section);
  }

  function getStoryPageCrumbs({
    headline = '',
    url = '',
    sections: [storySection],
  } = {}) {
    let sectionCrumbsDataList = [];
    if (storySection) {
      sectionCrumbsDataList = getSectionPageCrumbs(storySection);
    }
    sectionCrumbsDataList.push({name: headline, url});
    return sectionCrumbsDataList;
  }

  function getBreadCrumbs(breadcrumb = {}) {
    const crumbsDataList = [{url: breadcrumb.url, name: breadcrumb.name}];
    return addCrumb(crumbsDataList);
  }

  if (
    data.breadcrumbs &&
    'name' in data.breadcrumbs &&
    'url' in data.breadcrumbs
  ) {
    breadcrumbsDataList = breadcrumbsDataList.concat(
      getBreadCrumbs(data.breadcrumbs)
    );
    return getSchemaBreadcrumbList(breadcrumbsDataList);
  }
  switch (pageType) {
    case 'section-page':
      breadcrumbsDataList = breadcrumbsDataList.concat(
        getSectionPageCrumbs(data.section)
      );
      break;
    case 'story-page':
      breadcrumbsDataList = breadcrumbsDataList.concat(
        getStoryPageCrumbs(data.story)
      );
      break;
    case 'story-page-amp':
      breadcrumbsDataList = breadcrumbsDataList.concat(
        getStoryPageCrumbs(data.story)
      );
      break;
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
export function StructuredDataTags(
  {structuredData = {}},
  config,
  pageType,
  response = {},
  {url}
) {
  const tags = [];
  const {story = {}, timezone = null } = response.data || {};
  const entities = get(response, ['data', 'linkedEntities'], null) || [];
  const {config: publisherConfig = {}} = response;
  const {articleType = ''} = publisherConfig['publisher-settings'] || {};
  const isStructuredDataEmpty = Object.keys(structuredData).length === 0;
  const enableBreadcrumbList = get(
    structuredData,
    ['enableBreadcrumbList'],
    true
  );
  const structuredDataTags = get(structuredData, ['structuredDataTags'], []);

  let articleData = {};

  if (!isStructuredDataEmpty) {
    articleData = generateArticleData(
      structuredData,
      story,
      publisherConfig,
      pageType,
      timezone
    );
    structuredDataTags.map(type => {
      if (pageType === type) {
        tags.push(ldJson('Organization', structuredData.organization));
        if (structuredData.website) {
          tags.push(
            ldJson(
              'Website',
              Object.assign(
                {},
                generateWebSiteData(structuredData, story, publisherConfig)
              )
            )
          );
        }
      }
    });
  }

  if (!isStructuredDataEmpty && pageType === 'home-page') {
    tags.push(ldJson('Organization', structuredData.organization));
    if (structuredData.website) {
      tags.push(
        ldJson(
          'Website',
          Object.assign(
            {},
            generateWebSiteData(structuredData, story, publisherConfig)
          )
        )
      );
    }
  }

  if (!isStructuredDataEmpty && enableBreadcrumbList) {
    tags.push(
      ldJson(
        'BreadcrumbList',
        generateBreadcrumbListData(pageType, publisherConfig, response.data)
      )
    );
  }

  if (!isStructuredDataEmpty && pageType === 'story-page') {
    const newsArticleTags = generateNewsArticleTags();
    newsArticleTags
      ? tags.push(storyTags(), newsArticleTags)
      : tags.push(storyTags());
  }

  if (!isStructuredDataEmpty && pageType === 'story-page-amp') {
    const newsArticleTags = generateNewsArticleTags();
    newsArticleTags
      ? tags.push(storyTags(), newsArticleTags)
      : tags.push(storyTags());
  }

  if (!isStructuredDataEmpty && structuredData.header) {
    tags.push(ldJson('WPHeader', getSchemaHeader(structuredData.header)));
  }

  if (!isStructuredDataEmpty && structuredData.footer) {
    tags.push(ldJson('WPFooter', getSchemaFooter(structuredData.footer)));
  }

  if (entities.length > 0) {
    for (let entity of entities) {
      const entityTags = generateTagsForEntity(entity, ldJson);
      entityTags && tags.push(entityTags);
    }
  }

  function generateNewsArticleTags() {
    if (structuredData.enableNewsArticle) {
      return ldJson(
        'NewsArticle',
        Object.assign(
          {},
          articleData,
          generateNewsArticleData(
            structuredData,
            story,
            publisherConfig,
            pageType
          )
        )
      );
    }
  }

  function storyTags() {
    if (
      structuredData.enableLiveBlog &&
      story['story-template'] === 'live-blog'
    ) {
      return ldJson(
        'LiveBlogPosting',
        Object.assign(
          {},
          generateLiveBlogPostingData(
            structuredData,
            story,
            publisherConfig,
            pageType,
            timezone
          )
        )
      );
    }

    if (structuredData.enableVideo && story['story-template'] === 'video') {
      return ldJson(
        'VideoObject',
        generateVideoArticleData(
          structuredData,
          story,
          publisherConfig,
          pageType,
          timezone
        )
      );
    }

    if (structuredData.enableNewsArticle !== 'withoutArticleSchema') {
      return ldJson('Article', articleData);
    }
    return {};
  }

  // All Pages have: Publisher, Site
  // Story Page have : Article/NewsArticle/LiveBlog/Review as appropriate
  return tags;
}
