import { get } from "lodash";
import { getTitle } from "../generate-common-seo";
import { stripMillisecondsFromTime } from "../utils";
export const getSchemaContext = { "@context": "https://schema.org" };

export function getSchemaType(type) {
  return { "@type": type };
}

export function getSchemaPerson(name, url = "") {
  return Object.assign(
    {},
    getSchemaType("Person"),
    {
      givenName: name,
      name: name,
    },
    url && { url: url }
  );
}

export function getSchemaFooter({ cssSelector }) {
  return cssSelector
    ? Object.assign({}, getSchemaContext, getSchemaType("WPFooter"), {
        cssSelector: cssSelector,
      })
    : {};
}

export function getSchemaHeader({ cssSelector }) {
  return cssSelector
    ? Object.assign({}, getSchemaContext, getSchemaType("WPHeader"), {
        cssSelector: cssSelector,
      })
    : {};
}

export function getSchemaBlogPosting(
  card = {},
  headline = "",
  image = "",
  structuredData = {},
  story = {},
  timezone,
  articleBody
) {
  return Object.assign({}, getSchemaType("BlogPosting"), {
    articleBody: articleBody,
    dateModified: stripMillisecondsFromTime(new Date(card["card-updated-at"]), timezone),
    dateCreated: stripMillisecondsFromTime(new Date(card["card-added-at"]), timezone),
    datePublished: stripMillisecondsFromTime(new Date(card["card-added-at"]), timezone),
    headline: headline,
    image: image,
  });
}

export function getSchemaPublisher(organization, orgUrl) {
  const id = { id: orgUrl };
  return {
    publisher: Object.assign({}, organization, id, getSchemaType("NewsMediaOrganization")),
  };
}

export function getSchemaMainEntityOfPage(id) {
  return {
    mainEntityOfPage: Object.assign({}, getSchemaType("WebPage"), { "@id": id }),
  };
}

export function getSchemaMovieReview(movieObject = {}) {
  const movieCreatedAt = get(movieObject, ["created-at"], null);
  const actors = get(movieObject, ["actors"], []).map((actor) => getSchemaPerson(actor.name));
  const directors = get(movieObject, ["directors"], []).map((director) => getSchemaPerson(director.name));
  const producers = get(movieObject, ["producers"], []).map((producer) => getSchemaPerson(producer.name));

  return {
    actors: actors,
    directors: directors,
    name: get(movieObject, ["name"], ""),
    sameAs: get(movieObject, ["sameAs"], ""),
    description: get(movieObject, ["meta-description"], ""),
    producer: producers,
    image: get(movieObject, ["photo", "0", "url"], ""),
    dateCreated: movieCreatedAt ? new Date(movieCreatedAt).toISOString() : "",
  };
}

export function getSchemaWebsite(website = {}) {
  const { url, searchpath, name, headline, keywords, queryinput } = website;

  return Object.assign(
    {},
    getSchemaContext,
    getSchemaType("WebSite"),
    {
      url: url,
      interactivityType: "mixed",
      name: name,
      headline: headline,
      keywords: keywords,
      copyrightHolder: Object.assign({}, getSchemaType("Organization"), { name: name }),
      potentialAction: {
        "@type": "SearchAction",
        target: `${url}/${searchpath}`,
        "query-input": queryinput,
      },
    },
    getSchemaMainEntityOfPage(url)
  );
}

export function getSchemaListItem(position = 0, name = "", url = "") {
  return Object.assign({}, getSchemaType("ListItem"), {
    position,
    name,
    item: url,
  });
}

export function getSchemaBreadcrumbList(breadcrumbsDataList) {
  const itemListElement = breadcrumbsDataList.map(({ name = "", url = "" }, index) =>
    getSchemaListItem(index + 1, name, url)
  );
  return Object.assign({}, getSchemaContext, getSchemaType("BreadcrumbList"), { itemListElement });
}

export function generateAuthorPageSchema(publisherConfig, data, url) {
  const sketchesHost = publisherConfig["sketches-host"];
  const author = get(data, ["author"], {});
  const authorMetadata = get(author, ["metadata"], {});
  const authorHREF = url["href"];
  const authorURL = `${sketchesHost}${authorHREF}`;
  return generateAuthorSchema(publisherConfig, author, authorURL, authorMetadata);
}

export function generateAuthorSchema(publisherConfig, author = {}, authorURL = "", authorMetadata = {}) {
  const sketchesHost = publisherConfig["sketches-host"];
  const publisherName = getTitle(publisherConfig);
  const metadata = Object.assign({}, get(author, ["metadata"], {}), authorMetadata);
  const metadataJobTitle = get(metadata, ["jobTitle"], "");
  const description = get(metadata, ["description"], "");
  const knowsAbout = get(metadata, ["knowsAbout"], "");
  return Object.assign(
    {},
    {
      name: get(author, ["name"], ""),
      jobTitle: metadataJobTitle || "Author",
    },
    authorURL && { url: authorURL },
    description && { description },
    knowsAbout && { knowsAbout },
    {
      worksFor: {
        "@type": "NewsMediaOrganization",
        name: publisherName,
        url: sketchesHost,
      },
    }
  );
}

export function generateStoryAuthorSchema(publisherConfig, author = {}) {
  const sketchesHost = publisherConfig["sketches-host"];
  const authorSlug = get(author, ["slug"], "");
  const authorURL = get(author, ["url"], "") || (authorSlug && `${sketchesHost}/author/${authorSlug}`) || "";
  return generateAuthorSchema(publisherConfig, author, authorURL);
}
