import {get} from 'lodash';

/**
 * AuthorTags adds the twitter:creator tag for story pages
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function AuthorTags(seoConfig, config, pageType, data, {url}) {
  if(pageType != 'story-page' || pageType != 'amp-story-page')
    return [];

  return [{name: "twitter:creator", content: get(data, ["data", "story", "author-name"])}];
}
