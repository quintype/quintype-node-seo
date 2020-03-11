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

/**
 * StoryAmpTags adds the amphref to stories which support amp.
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {(boolean|"public")} seoConfig.ampStoryPages Should amp story pages be shown for all stories (true), not shown (false), or only be shown for public stories ("public"). Default: true
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function StoryAmpTags(seoConfig, config, pageType, data, opts) {
  const story = get(data, ["data", "story"], {});
  if(showAmpTag(seoConfig, pageType, story)) {
    return [{
      tag: 'link',
      rel: 'amphtml',
      href: `${config['sketches-host']}/amp/story/${encodeURIComponent(story.slug)}`
    }];
  } else {
    return [];
  }
}
