import get from 'lodash/get';
import { isStoryPublic } from './utils';

function showAmpTag({ampStoryPages = true}, pageType, story) {
  if(!ampStoryPages || pageType !== 'story-page') {
    return false;
  }

  if (!get(story, ["is-amp-supported"])) {
    return false;
  }

  if(ampStoryPages === 'public' && !isStoryPublic(story)) {
    return false;
  }

  return true;
}

export function StoryAmpTags(seoConfig, config, pageType, data, opts) {
  const story = get(data, ["data", "story"], {});
  if(showAmpTag(seoConfig, pageType, story)) {
    return [{
      tag: 'link',
      rel: 'amphtml',
      href: `/amp/story/${encodeURIComponent(story.slug)}`
    }];
  } else {
    return [];
  }
}
