import {entries} from 'lodash';

export function objectToTags(object) {
  return entries(object)
    .filter(([key, value]) => value)
    .map(([key, value]) => ({[getPropertyName(key)]: key, content: value}));
}

function getPropertyName(key) {
  return (key.startsWith('fb:') || key.startsWith('og:')) ? 'property' : 'name';
}

export function stripMillisecondsFromTime(date) {
  const toReturn = date.toJSON();
  if(!toReturn)
    return toReturn;
  return toReturn.split('.')[0]+"Z";
}
