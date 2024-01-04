import get from "lodash/get";
import { isStoryPublic } from "./utils";

function showAmpTag({ ampStoryPages = true }, pageType, story) {
  if (!ampStoryPages || pageType !== "story-page") {
    return false;
  }

  const isAmpDisabled = get(story, ["metadata", "story-attributes", "disable-amp-for-single-story", "0"], "false");

  if (isAmpDisabled === "true") {
    return false;
  }

  if (ampStoryPages === "public" && !isStoryPublic(story)) {
    return false;
  }

  return true;
}

const getDomain = (url, domainSlug) => {
  const domain = domainSlug ? new URL(url).origin : "";
  try {
    return domain;
  } catch (err) {
    return "";
  }
};

/**
 * StoryAmpTags adds the amphref to stories which support amp.
 *
 * To disable adding amphref for a specific story, you need to create a story attribute in bold with the slug {disable-amp-for-single-story} and values {true} and {false}. Set its value to "true" in the story which you want to disable amp. Please make sure to name the attributes and values in the exact same way as mentioned
 * attribute slug: "disable-amp-for-single-story" values: "true" , "false"
 *
 * @extends Generator
 * @param {*} seoConfig
 * @param {(boolean|"public")} seoConfig.ampStoryPages Should amp story pages be shown for all stories (true), not shown (false), or only be shown for public stories ("public"). Default: true
 * @param {(boolean)} seoConfig.appendHostToAmpUrl If set to true, the url to be appended to the slug is computed based on the currentHostUrl and the domain slug, else the url is taken as the sketches host. Default: false
 * @param {(boolean)} seoConfig.decodeAmpUrl If set to true, the storySlug that goes as the amp href url is decoded, else the storyslug is encoded. Default: false
 * @param {(boolean)} seoConfig.ignoreAmpHtmlStoryTemplates pass all the story templates you want to ignore from add rel="amphtml" tag. Default: ["visual story"]
 * @param {...*} params See {@link Generator} for other Parameters
 */
export function StoryAmpTags(seoConfig, config, pageType, data = {}, opts) {
  const templatesToIgnore = seoConfig.ignoreAmpHtmlStoryTemplates || ["visual-story"];
  const story = get(data, ["data", "story"], {});
  const { currentHostUrl = "", domainSlug } = data;
  // TODO: Remove this condition and always make absolute URL if that's better for AMP discoverability.
  const ampUrlAppend = seoConfig.appendHostToAmpUrl
    ? getDomain(currentHostUrl, domainSlug) || config["sketches-host"]
    : "";
  const storySlug = seoConfig.decodeAmpUrl ? decodeURIComponent(story.slug) : encodeURIComponent(story.slug);
  const { ampPageBasePath = "/amp/story" } = seoConfig;
  const ampUrl =
    story["story-template"] === "visual-story"
      ? `${ampUrlAppend}/${storySlug}`
      : `${ampUrlAppend}${ampPageBasePath}/${storySlug}`;
  const ignoreStoryTemplate = templatesToIgnore.includes(story["story-template"]);
  if (showAmpTag(seoConfig, pageType, story) && !ignoreStoryTemplate) {
    return [
      {
        tag: "link",
        rel: "amphtml",
        href: ampUrl,
      },
    ];
  } else {
    return [];
  }
}
