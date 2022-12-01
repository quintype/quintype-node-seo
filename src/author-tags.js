import { get } from "lodash";

/**
 * AuthorTags adds the twitter:creator tag for story pages
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {...*} params See {@link Generator} for other Parameters
 */

export function AuthorTags(seoConfig, config, pageType, data, { url }) {
  if (pageType === "story-page" || pageType === "story-page-amp") {
    return [
      {
        name: "twitter:creator",
        content: getTwitterCreator(data),
      },
    ];
  }
  return [];
}

function getTwitterCreator(storyData) {
  const twitterData = get(storyData, ["data", "story", "authors", 0, "social", "twitter"], {}) || {};
  const twitterUrl = twitterData.url || "";
  const twitterHandle = twitterData.handle || "";
  if (twitterHandle.startsWith("@")) return twitterHandle;
  const twitterHandleFromUrl = twitterUrl.split("/").pop();
  if (twitterHandleFromUrl) {
    if (twitterHandleFromUrl.startsWith("@")) return twitterHandleFromUrl;
    return `@${twitterHandleFromUrl}`;
  }
  return get(storyData, ["data", "story", "author-name"]);
}
