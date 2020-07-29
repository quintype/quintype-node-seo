import {get} from 'lodash';
import {objectToTags} from './utils';

/**
 * StaticTags puts whatever tags you've passed to it
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {Object} seoConfig.staticTags List of tags to be added. ex: `{"viewport": "width=device-width,initial-scale=1.0"}`
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function StaticTags(seoConfig, config, pageType, data, {url}) {
  return objectToTags(seoConfig.staticTags || {})
}
