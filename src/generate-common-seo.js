import omitBy from 'lodash/omitBy';
import isUndefined from 'lodash/isUndefined';
import get from 'lodash/get';

export function getTitle(config) {
  return config["publisher-settings"] ? config["publisher-settings"]["title"] : config["publisher-name"];
}

export function generateStaticData(config) {
  const title = getTitle(config);
  const themeConfig = config["theme-attributes"] || {};
  const publicIntegrations = get(config, ['public-integrations'], {});
  const staticData = {
    "twitter:site": title,
    "twitter:domain": config["sketches-host"],
    "twitter:app:name:ipad": themeConfig["twitter_app_name_ipad"],
    "twitter:app:name:googleplay": themeConfig["twitter_app_name_googleplay"],
    "twitter:app:id:googleplay": themeConfig["twitter_app_id_googleplay"],
    "twitter:app:name:iphone": themeConfig["twitter_app_name_iphone"],
    "twitter:app:id:iphone": themeConfig["twitter_app_id_iphone"],
    "apple-itunes-app": themeConfig["apple_itunes_app"],
    "google-play-app": themeConfig["google_play_app"],
    "fb:app_id": get(publicIntegrations, ['facebook', 'app-id']) || get(themeConfig, ["fb_app_id"]),
    "fb:pages": themeConfig["fb_pages"],
    "og:site_name": title
  };

  return omitBy(staticData, isUndefined);
}

export function generateImageObject(config = {}) {
  const {"theme-attributes": themeConfig = {}} = config;
  return ({
    "@context": "http://schema.org",
    "@type": "ImageObject",
    "author": config['publisher-name'],
    "contentUrl": themeConfig.logo,
    "url": themeConfig.logo,
    "name": "logo",
  });
}

export function generateStructuredData(config) {
  const title = getTitle(config);
  const themeConfig = config["theme-attributes"];
  const socialLinks = config["social-links"];

  if(!themeConfig || !themeConfig.logo) {
    return {};
  }

  return {
    organization: {
      name: title,
      url: config["sketches-host"],
      logo: generateImageObject(config),
      sameAs: socialLinks ? Object.values(socialLinks) : []
    },
    enableNewsArticle: !!themeConfig['structured_data_news_article'],
    website: {
      url: config["sketches-host"],
      searchpath: "search?q={query}",
      queryinput: "required name=query"
    },
  }
}