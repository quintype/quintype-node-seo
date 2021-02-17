import {entries} from 'lodash';
import { URL, URLSearchParams } from 'url';
import { format, utcToZonedTime } from 'date-fns-tz'

export function objectToTags(object) {
  return entries(object)
    .filter(([key, value]) => value)
    .map(([key, value]) => ({[getPropertyName(key)]: key, content: value}));
}

function getPropertyName(key) {
  return (key.startsWith('fb:') || key.startsWith('og:')) ? 'property' : 'name';
}

export function stripMillisecondsFromTime(date, timezone) {
  const zoneTime = timezone ? utcToZonedTime(date, timezone) : null;
  const formatZonedTime = zoneTime ? format(zoneTime, 'yyyy-MM-dd HH:mm:ssXXX', { timeZone }) : "";
  const toReturn = date.toJSON();
  return timezone ? formatZonedTime : (toReturn.split('.')[0]+"Z" || "");
}

export function getQueryParams(url) {
  const urlObj =  new URL(url);
  const search_params = new URLSearchParams(urlObj.search);
  const getWidth = search_params.get('w') || '';
  const getHeight = search_params.get('h') || '';
  return {width: getWidth, height: getHeight};
}

export function isStoryPublic(story) {
  return story.access === undefined || story.access === null || story.access === 'public';
}
