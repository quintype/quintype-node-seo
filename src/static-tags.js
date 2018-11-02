import { get } from "lodash";
import { objectToTags } from "./utils";

export function StaticTags(seoConfig, config, pageType, data, { url }) {
  return objectToTags(seoConfig.staticTags || {});
}
