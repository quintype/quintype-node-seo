import get from 'lodash/get';
import { isStoryPublic } from './utils';

function storyPageAmpTags(story, ampStoryConfig) {
  if(ampStoryConfig === 'public' && !isStoryPublic(story)) {
    return [];
  }

  return [{
    tag: 'link',
    rel: 'amphtml',
    href: `/amp/story/${encodeURIComponent(story.slug)}`
  }];
}

export function StoryAmpTags(seoConfig, config, pageType, data, opts) {
  const ampStoryPages = get(seoConfig, ["ampStoryPages"], true);

  if (ampStoryPages && pageType == 'story-page' && get(data, ["data", "story", "is-amp-supported"]))
    return storyPageAmpTags(get(data, ["data", "story"]), ampStoryPages)
  else
    return []
}
