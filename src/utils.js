import {entries} from 'lodash';

export function objectToTags(object) {
  return entries(object)
    .filter(([key, value]) => value)
    .map(([key, value]) => ({[getPropertyName(key)]: key, content: value}));
}

function getPropertyName(key) {
  return (key.startsWith('fb:') || key.startsWith('og:')) ? 'property' : 'name';
}
