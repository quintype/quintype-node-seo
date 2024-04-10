import { get, isEmpty } from "lodash";
import { objectToTags } from "./utils";

function buildTagsFromStory(config, story, url = {}, data = {}) {
  if (!story) return;

  function getStoryCardMetadata(cardId) {
    const { metadata = {} } = story.cards.find((card) => card.id === cardId) || {};
    const urlWithCardId = `${config["sketches-host"]}/${story.slug}?cardId=${cardId}`;

    if (metadata && !isEmpty(metadata) && metadata["social-share"]) {
      return {
        title: metadata["social-share"].title || story.headline,
        description: metadata["social-share"].message || story.summary,
        ogUrl: urlWithCardId,
        ogTitle: metadata["social-share"].title || story.headline,
        ogDescription: metadata["social-share"].message || story.summary,
      };
    }
    return metadata;
  }

  const seo = story.seo || {};

  const storyUrl = story.url || `${config["sketches-host"]}/${story.slug}`;

  const customSeo = get(data, ["data", "customSeo"], {});
  const authors = get(story, ["authors"], []).map((author) => author.name);
  const title = customSeo.title || seo["meta-title"] || story.headline;
  const pageTitle = customSeo["page-title"] || seo["meta-title"] || story.headline;
  const description = customSeo.description || seo["meta-description"] || story.summary;
  const keywords = (customSeo.keywords || seo["meta-keywords"] || (story.tags || []).map((tag) => tag.name)).join(",");
  const ogUrl = customSeo.ogUrl || get(seo, ["og", "url"]) || storyUrl;
  const getOgTitle =
    customSeo.ogTitle || get(story, ["alternative", "social", "default", "headline"], story.headline) || story.headline;
  const ogDescription = customSeo.ogDescription || story.summary;
  const canonicalUrl = customSeo.canonicalUrl || story["canonical-url"] || storyUrl;
  const storyMetaData = {
    title,
    "page-title": pageTitle,
    description,
    keywords,
    canonicalUrl,
    ogUrl,
    ogTitle: getOgTitle,
    ogDescription,
    storyUrl,
    author: authors,
  };

  if (url.query && url.query.cardId) {
    const storyCardMetadata = getStoryCardMetadata(url.query.cardId);
    return Object.assign({}, storyMetaData, storyCardMetadata); //TODO rewrite in spread syntax, add babel plugin
  }

  return storyMetaData;
}

function buildTagsFromTopic(config, tag, url = {}, data) {
  if (isEmpty(tag)) return;
  const customSeo = get(data, ["data", "customSeo"], {});
  const tagName = customSeo.title || tag["meta-title"] || tag.name;
  const pageTitle = customSeo["page-title"] || tagName;
  const tagDescription = customSeo.description || tag["meta-description"];
  const description = `Read stories listed under on ${tag.name}`;
  const tagUrl = `${config["sketches-host"]}${url.pathname}`;
  const canonicalSlug = tag["canonical-slug"] || url.pathname;
  const canonicalUrl = customSeo.canonicalUrl || `${config["sketches-host"]}${canonicalSlug}`;
  const ogTitle = customSeo.ogTitle || tagName;
  const ogDescription = customSeo.ogDescription || description;
  const topicMetaData = {
    title: tagName,
    "page-title": pageTitle,
    description: tagDescription || description,
    keywords: tagName,
    canonicalUrl,
    ogUrl: tagUrl,
    ogTitle,
    ogDescription,
  };

  return topicMetaData;
}

function buildTagsFromNotfoundPage(config, url = {}, data) {
  const homeSeoData = config["seo-metadata"].find((page) => page["owner-type"] === "home") || {
    data: { description: "" },
  };
  const customSeo = get(data, ["data", "customSeo"], {});
  const title = customSeo.title || "404 - Page not found  ";
  const pageTitle = customSeo["page-title"] || title;
  const description = customSeo.description || homeSeoData.data.description || "404 - Page not found";
  const pageUrl = `${config["sketches-host"]}${url.pathname}`;
  const canonicalSlug = url.pathname;
  const canonicalUrl = customSeo.canonicalUrl || `${config["sketches-host"]}${canonicalSlug}`;
  const ogTitle = customSeo.ogTitle || title;
  const ogDescription = customSeo.ogDescription || description;
  const notFoundMetaData = {
    title: title,
    "page-title": pageTitle,
    description: description,
    keywords: title,
    canonicalUrl,
    ogUrl: pageUrl,
    ogTitle,
    ogDescription,
  };

  return notFoundMetaData;
}

function buildTagsFromAuthor(config, author, url = {}, data) {
  if (isEmpty(author)) return;

  const customSeo = get(data, ["data", "customSeo"], {});
  const title = customSeo.title || author.name;
  const pageTitle = customSeo["page-title"] || title;
  const description = customSeo.description || author.bio || `View all articles written by ${title}`;
  const ogTitle = customSeo.ogTitle || author.name;
  const authorUrl = `${config["sketches-host"]}${url.pathname}`;
  const ogDescription = customSeo.ogDescription || description;
  const canonicalUrl = customSeo.canonicalUrl || authorUrl;

  return {
    title,
    "page-title": pageTitle,
    description,
    keywords: `${title},${config["publisher-name"]}`,
    canonicalUrl,
    ogUrl: authorUrl,
    ogTitle,
    ogDescription,
  };
}

function buildCustomTags(customTags = {}, pageType = "") {
  const configObject = customTags[pageType];
  if (configObject) {
    return configObject;
  }
  return {};
}

function buildTagsFromStaticPage(config, page, url = {}, data) {
  const seoData = get(page, ["metadata", "seo"], {});
  const customSeo = get(data, ["data", "customSeo"], {});

  const { "meta-title": metaTitle, "meta-description": metaDescription, "meta-keywords": keywords } = seoData;

  const title = customSeo.title || metaTitle || page.title;
  const pageTitle = customSeo["page-title"] || title;
  const description = customSeo.description || metaDescription;
  const ogTitle = customSeo.ogTitle || title;
  const staticPageUrl = `${config["sketches-host"]}${url.pathname}`;
  const ogDescription = customSeo.ogDescription || description;
  const canonicalUrl = customSeo.canonicalUrl || staticPageUrl;

  return {
    title,
    "page-title": pageTitle,
    description,
    keywords: `${title},${config["publisher-name"]}`,
    canonicalUrl,
    ogUrl: staticPageUrl,
    ogTitle,
    ogDescription,
    keywords: customSeo.keywords || keywords,
  };
}

// The findRelevantConfig method call has no ownerId for home page.
// This causes the seoMetadata to be undefined.
// So the default value for the ownerId is set to null.

function getSeoData(config, pageType, data, url = {}, seoConfig = {}) {
  function findRelevantConfig(ownerType, ownerId = null) {
    const seoMetadata =
      config["seo-metadata"].find((page) => page["owner-type"] === ownerType && page["owner-id"] === ownerId) || {};
    const { sections = [] } = config;
    const section = sections.find((section) => ownerType == "section" && section.id === ownerId) || {};
    const customSeo = get(data, ["data", "customSeo"], {});
    const sectionCollMetadata = get(data, ["data", "collection", "metadata"], {});
    if (seoMetadata.data || section.id || !isEmpty(customSeo)) {
      const result = Object.assign(
        {},
        {
          "page-title": customSeo["page-title"] || section.name,
          title: customSeo.title || section.name,
          canonicalUrl: customSeo["canonicalUrl"] || sectionCollMetadata["canonical-url"] || section["section-url"] || undefined,
        },
        seoMetadata.data
      );

      if (!result.description) {
        const homeSeoData = config["seo-metadata"].find((page) => page["owner-type"] === "home") || {
          data: { description: "" },
        };
        result.description = customSeo.description || homeSeoData.data.description;
      }

      result.ogTitle = customSeo.ogTitle || result.title;
      result.ogDescription = customSeo.ogDescription || result.description;
      return result;
    }
  }

  if (seoConfig.customTags && seoConfig.customTags[pageType]) {
    return buildCustomTags(seoConfig.customTags, pageType);
  }

  function getShellSeoData(config) {
    const seoMetadata = config["seo-metadata"].find((meta) => meta["owner-type"] === "home") || {};
    return Object.assign({}, seoMetadata.data, { canonicalUrl: SKIP_CANONICAL });
  }

  switch (pageType) {
    case "home-page":
      return findRelevantConfig("home");
    case "section-page":
      return (
        findRelevantConfig("section", get(data, ["data", "section", "id"])) ||
        getSeoDataFromCollection(config, data) ||
        getSeoData(config, "home-page", data, url)
      );
    case "collection-page":
      return getSeoDataFromCollection(config, data) || getSeoData(config, "home-page", data, url);
    case "tag-page":
      return (
        buildTagsFromTopic(config, get(data, ["data", "tag"]), url, data) || getSeoData(config, "home-page", data, url)
      );
    case "story-page":
      return (
        buildTagsFromStory(config, get(data, ["data", "story"]), url, data) ||
        getSeoData(config, "home-page", data, url)
      );
    case "visual-story":
      return buildTagsFromStory(config, get(data, ["story"]), url, data) || getSeoData(config, "home-page", data, url);
    case "story-page-amp":
      return (
        buildTagsFromStory(config, get(data, ["data", "story"]), url, data) ||
        getSeoData(config, "home-page", data, url)
      );
    case "author-page":
      return (
        buildTagsFromAuthor(config, get(data, ["data", "author"], {}), url, data) ||
        getSeoData(config, "home-page", data, url)
      );
    case "static-page":
      return (
        buildTagsFromStaticPage(config, get(data, ["data", "page"], {}), url, data) ||
        getSeoData(config, "home-page", data, url)
      );
    case "not-found":
      return buildTagsFromNotfoundPage(config, url, data) || getSeoData(config, "home-page", data, url);
    case "shell":
      return getShellSeoData(config);
    default:
      return getSeoData(config, "home-page", data, url);
  }
}

function getSeoDataFromCollection(config, data) {
  if (get(data, ["data", "collection", "name"])) {
    let { name, summary, metadata } = get(data, ["data", "collection"]);
    const customSeo = get(data, ["data", "customSeo"], {});

    if (!summary) {
      summary = (getSeoData(config, "home-page", data) || {}).description;
    }
    const title = customSeo.title || name;
    const pageTitle = customSeo["page-title"] || name;
    const ogTitle = customSeo.ogTitle || title;
    const description = customSeo.description || summary;
    const ogDescription = customSeo.ogDescription || summary;
    const collCanonicalUrl = metadata["canonical-url"] || SKIP_CANONICAL;
    return {
      "page-title": pageTitle,
      title,
      ogTitle,
      description,
      ogDescription,
      canonicalUrl: collCanonicalUrl,
    };
  }
}

const SKIP_CANONICAL = "__SKIP__CANONICAL__";

/**
 * TextTags adds the majority of basic tags, such as
 * * Canonical URLs
 * * Title and Description
 * * Keywords
 *
 * If the current URL contains a cardId in the query parameters, then the title and description will come from *card["social-share"]*
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {boolean} seoConfig.enableOgTags Add og tags for Facebook
 * @param {boolean} seoConfig.enableTwitterCards Add twitter tags
 * @param {boolean} seoConfig.enableNews Add tags for Google News, like news_keywords
 * @param {Object} seoConfig.customTags Add tags for a custom page type. Usually looks like `{"custom-page": {"title": "value", "canonicalUrl": "value"}}`
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function TextTags(seoConfig, config, pageType, data, { url }) {
  const seoData = getSeoData(config, pageType, data, url, seoConfig);
  const customSeo = get(data, ["data", "customSeo"], {});

  if (!seoData) return [];

  const currentUrl = `${config["sketches-host"]}${url.pathname}`;

  const basicTags = {
    description: customSeo.description || seoData.description,
    title: customSeo.title || seoData.title,
    keywords: customSeo.keywords || seoData.keywords,
  };

  const ogUrl = customSeo.ogUrl || seoData.ogUrl || seoData.canonicalUrl || currentUrl;
  const ogTags = seoConfig.enableOgTags
    ? {
        "og:type": pageType === "story-page" || pageType === "story-page-amp" ? "article" : "website",
        "og:url": ogUrl === SKIP_CANONICAL ? undefined : ogUrl,
        "og:title": customSeo.ogTitle || seoData.ogTitle,
        "og:description": customSeo.ogDescription || seoData.ogDescription,
      }
    : undefined;

  const twitterTags = seoConfig.enableTwitterCards
    ? {
        "twitter:card": "summary_large_image",
        "twitter:title": customSeo.twitterTitle || seoData.ogTitle,
        "twitter:description": customSeo.twitterDescription || seoData.ogDescription,
      }
    : undefined;

  const allTags = Object.assign(basicTags, ogTags, twitterTags);

  const commonTags = [{ tag: "title", children: customSeo.title || data.title || seoData["page-title"] }];

  const canonical = seoData.canonicalUrl || currentUrl;
  if (canonical != SKIP_CANONICAL) {
    commonTags.push({ tag: "link", rel: "canonical", href: canonical });
  }

  if (pageType === "story-page" || pageType === "story-page-amp") {
    commonTags.push({ name: "author", content: seoData.author });
  }

  if ((pageType === "story-page" || pageType === "story-page-amp") && seoConfig.enableNews) {
    commonTags.push({ name: "news_keywords", content: seoData.keywords });
    if (get(data, ["data", "story", "seo", "meta-google-news-standout"]))
      commonTags.push({ tag: "link", rel: "standout", href: seoData.storyUrl || currentUrl });
  }

  return commonTags.concat(objectToTags(allTags));
}

export function getTitle(seoConfig, config, pageType, data, params) {
  const customSeo = get(data, ["data", "customSeo"], {});

  if (get(data, ["title"])) return customSeo.title || get(data, ["title"]);

  if (get(data, ["data", "title"])) return customSeo.title || get(data, ["data", "title"]);

  const seoData = getSeoData(config, pageType, data, undefined, seoConfig) || {};
  return customSeo.title || seoData["page-title"];
}
