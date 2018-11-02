import { get } from "lodash";

export function AuthorTags(seoConfig, config, pageType, data, { url }) {
  if (pageType != "story-page") return [];

  return [
    {
      name: "twitter:creator",
      content: get(data, ["data", "story", "author-name"])
    }
  ];
}
