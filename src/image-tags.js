import { get, isEmpty } from "lodash";
import { FocusedImage } from "quintype-js";

function pickImageFromCard(story, cardId) {
  const { metadata = {} } = story.cards.find((card) => card.id === cardId) || {};
  if (metadata && !isEmpty(metadata) && get(metadata, ["social-share", "image", "key"], false)) {
    const alt =
      metadata["social-share"].image.attribution ||
      metadata["social-share"].title ||
      metadata["social-share"].message ||
      getAttribution(story);
    return {
      image: new FocusedImage(metadata["social-share"].image.key, metadata["social-share"].image.metadata || {}),
      alt,
    };
  }
}

function getAttribution(story) {
  return (
    story["hero-image-attribution"] ||
    story.summary ||
    get(story, ["alternative", "home", "default", "headline"]) ||
    story.headline
  );
}

/**
 * priority:
 * 1. alternate social image
 * 2. alternate hero image
 * 3. hero image
 * 4. "fallbackSocialImage" from seo config
 * 5. logo_url from /api/v1/config > theme-attributes
 * 5. logo from /api/v1/config > theme-attributes
 * 6. undefined (meta tag won't get created)
 */
function pickImageFromStory({ story, config, seoConfig }) {
  function getAlt(type, key, fallback) {
    return get(story, ["alternative", `${type}`, "default", "hero-image", `${key}`], fallback);
  }

  const alt = getAttribution(story);
  const fallbackSocialImage = get(seoConfig, ["fallbackSocialImage"]);
  const altHeroImg = getAlt("home", "hero-image-s3-key", null);
  const altSocialHeroImg = getAlt("social", "hero-image-s3-key", null);
  const storyHeroImage = get(story, ["hero-image-s3-key"]);
  const logo_url = get(config, ["theme-attributes", "logo_url"]);
  const logo = get(config, ["theme-attributes", "logo"]);

  if (altSocialHeroImg) {
    const metadata = getAlt("social", "hero-image-metadata", {});
    return { image: new FocusedImage(altSocialHeroImg, metadata), alt };
  } else if (altHeroImg) {
    const metadata = getAlt("home", "hero-image-metadata", {});
    return { image: new FocusedImage(altHeroImg, metadata), alt };
  } else if (storyHeroImage) {
    const metadata = get(story, ["hero-image-metadata"], {});
    return { image: new FocusedImage(storyHeroImage, metadata), alt };
  } else if (fallbackSocialImage) {
    return { image: fallbackSocialImage, alt, includesHost: true };
  } else if (logo_url) {
    return { image: logo_url, alt, includesHost: true };
  } else if (logo) {
    return { image: logo, alt, includesHost: true };
  } else {
    return { image: undefined, alt: undefined };
  }
}

function pickImageFromCollection(collection) {
  const coverImage = get(collection, ["metadata", "cover-image"]) || {};
  if (!coverImage["cover-image-s3-key"]) return {};
  const alt = collection.summary || collection.name || null;
  return { image: new FocusedImage(coverImage["cover-image-s3-key"], coverImage["cover-image-metadata"] || {}), alt };
}

// The image is grabbed from the story, else from from the collection
function pickImage({ pageType, config, seoConfig, data, url }) {
  if (pageType === "story-page" && url.query && url.query.cardId) {
    const story = get(data, ["data", "story"]) || {};
    return pickImageFromCard(story, url.query.cardId) || pickImageFromStory({ story, seoConfig, config });
  } else if (pageType === "visual-story" && url.query && url.query.cardId) {
    const story = get(data, ["story"]) || {};
    return pickImageFromCard(story, url.query.cardId) || pickImageFromStory({ story, seoConfig, config });
  } else if (pageType === "story-page" || pageType === "story-page-amp") {
    const story = get(data, ["data", "story"]) || {};
    return pickImageFromStory({ story, seoConfig, config });
  } else if (pageType === "visual-story") {
    const story = get(data, ["story"]) || {};
    return pickImageFromStory({ story, seoConfig, config });
  } else if (get(data, ["data", "collection"])) {
    return pickImageFromCollection(get(data, ["data", "collection"]));
  } else {
    return { image: undefined, alt: undefined };
  }
}

/**
 * ImageTags adds the og and twitter images
 *
 * For a story page, this comes from the hero image. For a collection page (including home and section pages), the image will come from the collection hero image.
 *
 * If the current story URL contains a cardId in the query parameters, then the title and description will come from *card["social-share"]*
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {boolean} seoConfig.enableOgTags Add og tags for Facebook
 * @param {boolean} seoConfig.enableTwitterCards Add twitter tags
 * @param {string} seoConfig.fallbackSocialImage Optional. Should be full URL (i.e. include https://). This image will be shown in og:image and twitter:image meta tags for stories having no hero image or alternate hero/social images
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function ImageTags(seoConfig, config, pageType, data, { url = {} }) {
  const { image, alt, includesHost = false } = pickImage({ pageType, data, url, seoConfig, config });
  const story = get(data, ["data", "story"]);
  const publisherConfig = get(data, ["config", "publisher-attributes"], {});
  const fallbackValue = story ? false : true;
  const isWatermarkDisabled = get(story, ["metadata", "watermark-image", "disabled"], fallbackValue);
  const watermarkImageS3Key = get(story, ["watermark", "social", "image-s3-key"], "");
  const imageCdnSrc = publisherConfig.cdn_src;
  const imageCdnUrl = publisherConfig.cdn_image || config["cdn-image"];

  if (!image) {
    return [];
  }

  const tags = [];

  if (pageType == "story-page") {
    tags.push({ name: "robots", content: "max-image-preview:large" });
  }
  const actualImageProp = { w: 1200, auto: "format,compress", ogImage: true, enlarge: true };

  const renderWatermarkImage = (cdnSrc, cdnURL) => {
    if (cdnSrc && cdnSrc.includes("gumlet") && watermarkImageS3Key.length > 0) {
      return `https://${cdnURL}/${watermarkImageS3Key}`;
    }
    return watermarkImageS3Key;
  };

  const watermarkImageProp = {
    w: 1200,
    auto: "format,compress",
    ogImage: true,
    mode: "crop",
    overlay: renderWatermarkImage(imageCdnSrc, imageCdnUrl),
    overlay_position: "bottom",
    overlay_width: 100,
  };

  const getImageUrl = (imageRatio, imageProp) => {
    return includesHost ? image : `https://${imageCdnUrl}/${image.path(imageRatio, imageProp)}`;
  };

  const getContent = (actualImageAR, watermarkImageAR) => {
    return isWatermarkDisabled
      ? getImageUrl(actualImageAR, actualImageProp)
      : getImageUrl(watermarkImageAR, watermarkImageProp);
  };

  if (seoConfig.enableTwitterCards) {
    tags.push({
      name: "twitter:image",
      content: getContent([16, 9], [40, 21]),
    });
    alt && tags.push({ property: "twitter:image:alt", content: alt });
  }

  if (seoConfig.enableOgTags) {
    tags.push({
      property: "og:image",
      content: getContent([40, 21], [40, 21]),
    });
    tags.push({ property: "og:image:width", content: 1200 });
    if (get(image, ["metadata", "focus-point"])) {
      tags.push({ property: "og:image:height", content: 630 });
    }
    alt && tags.push({ property: "og:image:alt", content: alt });
  }

  return tags;
}
