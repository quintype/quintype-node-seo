import {entries} from 'lodash';
import { URL, URLSearchParams } from 'url';

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

export function getQueryParams(url) {
  const urlObj =  new URL(url);
  const search_params = new URLSearchParams(urlObj.search); 
  const getWidth = search_params.get('w') || '';
  const getHeight = search_params.get('h') || '';
  return {width: getWidth, height: getHeight};
}