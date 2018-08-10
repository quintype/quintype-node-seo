import {get, isEmpty} from 'lodash';
import {FocusedImage} from 'quintype-js';

function pickImageFromCard(story, urlQuery = {}) {
  const {cardId, elementId} = urlQuery;
  if (!cardId && !elementId) {
    return undefined;
  }

  const card = story.cards.find(card => card.id === cardId) || {};
  const element = elementId && (card['story-elements'] || []).find( element => element.id === elementId);
  if(element && element['image-s3-key']){
    return new FocusedImage(element['image-s3-key'],element['image-metadata']||{});
  }

  if(card.metadata && !isEmpty(card.metadata) && get(card.metadata, ['social-share', 'image', 'key'], false)) {
    return new FocusedImage(card.metadata['social-share'].image.key, card.metadata['social-share'].image.metadata || {});
  }
}

// function pickImageFromElement(story, cardId, elementId) {
//   const { 'story-elements': storyElements = [] } = story.cards.find(card => card.id === cardId) || {};
//   const { 'image-s3-key': imageS3Key } = storyElements && storyElements.find( element => element.id === elementId) || {};
//   return imageS3Key;
// }

function pickImageFromStory(story) {
  return new FocusedImage(story["hero-image-s3-key"], story["hero-image-metadata"] || {})
}

function pickImageFromCollection(collection) {
  const coverImage = get(collection, ["metadata", "cover-image"], {});
  if(!coverImage["cover-image-s3-key"])
    return;

  return new FocusedImage(coverImage["cover-image-s3-key"], coverImage["cover-image-metadata"] || {})
}

// The image is grabbed from the story, else from from the collection
function pickImage(pageType, data, url) {
  const story = get(data, ['data', 'story']) || {};
  if(pageType == 'story-page') {
    return pickImageFromCard(story, url.query) || 
           pickImageFromStory(story);
  } else if(get(data, ['data', 'collection'])) {
    return pickImageFromCollection(get(data, ['data', 'collection']))
  }
}

export function ImageTags(seoConfig, config, pageType, data, {url = {}}) {
  const image = pickImage(pageType, data, url);

  if(!image) {
    return [];
  }

  const tags = [];

  if(seoConfig.enableTwitterCards) {
    tags.push({name: "twitter:image", content: `https://${config['cdn-image']}/${image.path([16, 9], {w: 1200, auto: "format,compress"})}`})
  }

  if(seoConfig.enableOgTags) {
    tags.push({property: "og:image", content: `https://${config['cdn-image']}/${image.path([40, 21], {w: 1200, auto: "format,compress"})}`});
    tags.push({property: "og:image:width", content: 1200});
    if(get(image, ["metadata", "focus-point"])) {
      tags.push({property: "og:image:height", content: 630})
    }
  }

  return tags;
}
