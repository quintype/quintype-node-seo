import {get} from 'lodash';
import {FocusedImage} from 'quintype-js';

export function ImageTags(seoConfig, config, pageType, data, {url}) {
  if(pageType != 'story-page')
    return [];

  const story = get(data, ['data', 'story']) || {};

  if(!story['hero-image-s3-key'])
    return [];

  const tags = [];
  const image = new FocusedImage(story["hero-image-s3-key"], story["hero-image-metadata"] || {});

  if(seoConfig.enableTwitterCards) {
    tags.push({name: "twitter:image", content: `https://${config['cdn-image']}/${image.path([16, 9], {w: 1200, auto: "format,compress"})}`})
  }

  if(seoConfig.enableOgTags) {
    tags.push({property: "og:image", content: `https://${config['cdn-image']}/${image.path([40, 21], {w: 1200, auto: "format,compress"})}`});
    tags.push({property: "og:image:width", content: 1200});
    if(get(story, ["hero-image-metadata", "focus-point"])) {
      tags.push({property: "og:image:height", content: 630})
    }
  }

  return tags;
}
