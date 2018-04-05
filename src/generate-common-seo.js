export function generateCommonSeo(config) {
  const title = config["publisher-settings"]["title"];
  const themeConfig = config["theme-attributes"];

  const STATIC_TAGS = {
    "twitter:site": title ? title : "Madrid",
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
    "og:site_name": title ? title : "Madrid"
  };

  const socialLinks = config["social-links"];
  const STRUCTURED_DATA = {
    organization: {
      name: title,
      url: config["sketches-host"],
      logo: themeConfig ? themeConfig.logo : "https://quintype.com/logo.png",
      sameAs: socialLinks ? Object.values(socialLinks) : []
    }
  }

  return {
    staticTags: STATIC_TAGS,
    enableTwitterCards: true,
    enableOgTags: true,
    enableNews: true,
    structuredData: STRUCTURED_DATA
  };
}