import { format, utcToZonedTime } from "date-fns-tz";
import { entries, get } from "lodash";
import { URL, URLSearchParams } from "url";

export function objectToTags(object) {
  return entries(object)
    .filter(([key, value]) => value)
    .map(([key, value]) => ({ [getPropertyName(key)]: key, content: value }));
}

function getPropertyName(key) {
  return key.startsWith("fb:") || key.startsWith("og:") ? "property" : "name";
}

export function stripMillisecondsFromTime(date, timezone) {
  const toReturn = date.toJSON();
  if (!toReturn) return toReturn;
  const zonedTime = timezone && utcToZonedTime(date, timezone);
  const formatZonedTime = zonedTime && format(zonedTime, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: timezone });
  const formatToReturn = toReturn.split(".")[0] + "Z";
  return timezone ? formatZonedTime : formatToReturn;
}

export function getQueryParams(url) {
  const urlObj = new URL(url);
  const search_params = new URLSearchParams(urlObj.search);
  const getWidth = search_params.get("w") || "";
  const getHeight = search_params.get("h") || "";
  return { width: getWidth, height: getHeight };
}

export function isStoryPublic(story) {
  return story.access === undefined || story.access === null || story.access === "public";
}

export function getWatermarkImage(story, cdnSrc, cdnURL) {
  const watermarkImageS3Key = get(story, ["watermark", "social", "image-s3-key"], "false");
  if (cdnSrc && cdnSrc.includes("gumlet") && watermarkImageS3Key.length > 0) {
    return `https://${cdnURL}/${watermarkImageS3Key}`;
  }
  return watermarkImageS3Key;
}
