import get from 'lodash/get';

function storyPageAmpTags(story) {
  return [{
    tag: 'link',
    rel: 'amphtml',
    href: `/amp/story/${encodeURIComponent(story.slug)}`
  }];
}

export function StoryAmpTags(seoConfig, config, pageType, data, opts) {
  const ampStoryPages = get(seoConfig, ["ampStoryPages"], true);

  if(pageType == 'story-page' && ampStoryPages && get(data, ["data", "story", "is-amp-supported"]))
    return storyPageAmpTags(get(data, ["data", "story"]))
  else
    return []
}
