export function getTitle(config) {
  return config["publisher-settings"] ? config["publisher-settings"]["title"] : config["publisher-name"];
}

export function generateStaticData(config) {
  const title = getTitle(config);
  const themeConfig = config["theme-attributes"] || {};

  return {
    "twitter:site": title,
    "twitter:domain": config["sketches-host"],
    "twitter:app:name:ipad": themeConfig["twitter:app:name:ipad"],
    "twitter:app:name:googleplay": themeConfig["twitter:app:name:googleplay"],
    "twitter:app:id:googleplay": themeConfig["twitter:app:id:googleplay"],
    "twitter:app:name:iphone": themeConfig["twitter:app:name:iphone"],
    "twitter:app:id:iphone": themeConfig["twitter:app:id:iphone"],
    "apple-itunes-app": themeConfig["apple-itunes-app"],
    "google-play-app": themeConfig["google-play-app"],
    "fb:app_id": themeConfig["fb:app-id"],
    "fb:pages": themeConfig["fb:pages"],
    "og:site_name": title
  };
}

export function generateStructuredData(config) {
  const title = getTitle(config);
  const themeConfig = config["theme-attributes"];
  const socialLinks = config["social-links"];

  return {
    organization: {
      name: title,
      url: config["sketches-host"],
      logo: themeConfig ? themeConfig.logo : "https://quintype.com/logo.png",
      sameAs: socialLinks ? Object.values(socialLinks) : []
    }
  }
}