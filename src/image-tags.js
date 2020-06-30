import {get, isEmpty} from 'lodash';
import {FocusedImage} from 'quintype-js';

function pickImageFromCard(story, cardId) {
  const { metadata = {} } = story.cards.find(card => card.id === cardId) || {};
  if(metadata && !isEmpty(metadata) && get(metadata, ['social-share', 'image', 'key'], false)) {
    return new FocusedImage(metadata['social-share'].image.key, metadata['social-share'].image.metadata || {});
  }
}

function getSocialAlternateHeroImageS3Key(story) {
  function getAlternateProperties (type, key) {
    return get(story, ["alternative", `${type}`, "default", "hero-image", `${key}`]) ;
  }
  const alternateHomeS3Key = getAlternateProperties("home", "hero-image-s3-key");
  const alternateSocialS3Key = getAlternateProperties("social", "hero-image-s3-key");
  const socialAlternateHeroImageS3Key = (alternateSocialS3Key ? alternateSocialS3Key : alternateHomeS3Key) || story["hero-image-s3-key"];
  return socialAlternateHeroImageS3Key;
}
function getSocialAlternateHeroImageS3Metadata(story) {
  function getAlternateProperties (type, key) {
    return get(story, ["alternative", `${type}`, "default", "hero-image", `${key}`]) ;
  }
  const alternateSocialMetadata = getAlternateProperties("social", "hero-image-metadata");
  const alternateHomeMetadata = getAlternateProperties("home", "hero-image-metadata");
  const socialAlternateHeroImageS3Metadata = (alternateSocialMetadata ? alternateSocialMetadata : alternateHomeMetadata)  ||  story["hero-image-metadata"];
  return socialAlternateHeroImageS3Metadata;
}
function pickImageFromStory(story) {
  const SocialAlternateHeroImageS3Key = getSocialAlternateHeroImageS3Key(story);
  const SocialAlternateHeroImageS3Metadata = getSocialAlternateHeroImageS3Metadata(story);

  return new FocusedImage(SocialAlternateHeroImageS3Key, SocialAlternateHeroImageS3Metadata || {});
}

function pickAmpImageFromStory(story) {
  const SocialAlternateHeroImageS3Key = getSocialAlternateHeroImageS3Key(story);
  const SocialAlternateHeroImageS3Metadata = getSocialAlternateHeroImageS3Metadata(story);
  const AmpSocialAlternateHeroImageS3Metadata = Object.assign({}, SocialAlternateHeroImageS3Metadata, {width: 1200, height: 750});

   return new FocusedImage(SocialAlternateHeroImageS3Key, AmpSocialAlternateHeroImageS3Metadata || {});
}

function pickImageFromCollection(collection) {
  const coverImage = get(collection, ["metadata", "cover-image"]) || {};
  if(!coverImage["cover-image-s3-key"])
    return;

  return new FocusedImage(coverImage["cover-image-s3-key"], coverImage["cover-image-metadata"] || {})
}

// The image is grabbed from the story, else from from the collection
function pickImage(pageType, data, url) {
  if(pageType === 'story-page' && url.query && url.query.cardId) {
    const story = get(data, ['data', 'story']) || {};
    return pickImageFromCard(story, url.query.cardId) || pickImageFromStory(story);
  }else if(pageType === 'visual-story' && url.query && url.query.cardId) {
    const story = get(data, ['story']) || {};
    return pickImageFromCard(story, url.query.cardId) || pickImageFromStory(story);
  } else if(pageType === 'story-page') {
    const story = get(data, ['data', 'story']) || {};
    return pickImageFromStory(story);
  } else if(pageType === 'story-page-amp') {
    const story = get(data, ['data', 'story']) || {};
    return pickAmpImageFromStory(story);
  } else if(pageType === 'visual-story') {
    const story = get(data, ['story']) || {}; 
    return pickImageFromStory(story);
  } else if(get(data, ['data', 'collection'])) {
    return pickImageFromCollection(get(data, ['data', 'collection']))
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
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function ImageTags(seoConfig, config, pageType, data, {url = {}}) {
  const image = pickImage(pageType, data, url);

  if(!image) {
    return [];
  }

  const tags = [];

  if(seoConfig.enableTwitterCards) {
    tags.push({name: "twitter:image", content: `https://${config['cdn-image']}/${image.path([16, 9], {w: 1200, auto: "format,compress", ogImage: true})}`})
  }

  if(seoConfig.enableOgTags) {
    tags.push({property: "og:image", content: `https://${config['cdn-image']}/${image.path([40, 21], {w: 1200, auto: "format,compress", ogImage: true})}`});
    tags.push({property: "og:image:width", content: 1200});
    if(get(image, ["metadata", "focus-point"])) {
      tags.push({property: "og:image:height", content: 630})
    }
  }

  return tags;
}
