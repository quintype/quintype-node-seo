import {get, isEmpty} from 'lodash';
import {FocusedImage} from 'quintype-js';

function pickImageFromCard(story, cardId) {
  const { metadata = {} } = story.cards.find(card => card.id === cardId) || {};
  if(metadata && !isEmpty(metadata) && get(metadata, ['social-share', 'image', 'key'], false)) {
    return new FocusedImage(metadata['social-share'].image.key, metadata['social-share'].image.metadata || {});
  }
}

function pickImageFromStory(story) {
  return new FocusedImage(story["hero-image-s3-key"], story["hero-image-metadata"] || {})
}

// The image is grabbed from the story, else from from the collection
function pickImage(pageType, data, url) {
  if(pageType == 'story-page' && url.query && url.query.cardId) {
    const story = get(data, ['data', 'story']) || {};
    return pickImageFromCard(story, url.query.cardId) || pickImageFromStory(story);
  } else if(pageType == 'story-page') {
    const story = get(data, ['data', 'story']) || {};
    return pickImageFromStory(story);
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
    if(get(data, ["data", "story", "hero-image-metadata", "focus-point"])) {
      tags.push({property: "og:image:height", content: 630})
    }
  }

  return tags;
}
