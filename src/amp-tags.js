import {get} from 'lodash';

function storyPageAmpTags(story) {
  return [{
    tag: 'link',
    rel: 'amphtml',
    href: `/amp/story/${encodeURIComponent(story.slug)}`
  }];
}

export function StoryAmpTags(seoConfig, config, pageType, data, opts) {
  if(pageType == 'story-page' && get(data, ["data", "story", "is-amp-supported"]))
    return storyPageAmpTags(get(data, ["data", "story"]))
  else
    return []
}
