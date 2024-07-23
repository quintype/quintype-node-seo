import { get } from "lodash";
import { getTitle } from "../generate-common-seo";
import { stripMillisecondsFromTime } from "../utils";
export const getSchemaContext = { "@context": "http://schema.org" };

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
  author = {},
  headline = "",
  image = "",
  structuredData = {},
  story = {},
  timezone,
  articleBody
) {
  const { website: { url = "" } = {} } = structuredData;
  const orgUrl = get(structuredData, ["organization", "url"], "");
  return Object.assign(
    {},
    getSchemaType("BlogPosting"),
    getSchemaMainEntityOfPage(`${url}/${story.slug}`),
    getSchemaPublisher(structuredData.organization, orgUrl),
    {
      articleBody: articleBody,
      dateModified: stripMillisecondsFromTime(new Date(card["card-updated-at"]), timezone),
      dateCreated: stripMillisecondsFromTime(new Date(card["card-added-at"]), timezone),
      datePublished: stripMillisecondsFromTime(new Date(card["card-added-at"]), timezone),
      author: author,
      headline: headline,
      image: image,
    }
  );
}

export function getSchemaPublisher(organization, orgUrl) {
  const id = { id: orgUrl };
  return {
    publisher: Object.assign({}, getSchemaType("Organization"), getSchemaContext, organization, id),
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
  const publisherName = getTitle(publisherConfig);
  const authorHREF = url["href"];
  const authorURL = `${sketchesHost}${authorHREF}`;
  const authorName = get(data, ["author", "name"], "");
  return {
    name: authorName,
    jobTitle: "Author",
    url: authorURL,
    worksFor: {
      "@type": "NewsMediaOrganization",
      name: publisherName,
      url: sketchesHost,
    },
  };
}

export function generateRecipePageSchema(publisherConfig, data, url, story) {
  const sketchesHost = publisherConfig["sketches-host"];
  const publisherName = getTitle(publisherConfig);
  const authorHREF = url["href"];
  const authorURL = `${sketchesHost}${authorHREF}`;
  const authorName = get(data, ["author", "name"], "");
  // console.log("generateRecipePageSchema --->", { publisherConfig, data, url, story });
  return {
    "@context": "https://schema.org/",
    "@type": "Recipe",
    name: story.headline,
    url: story.url,
    author: {
      "@type": "Person",
      name: story["author-name"],
    },
    image: { "@type": "ImageObject", url: story.recipeUrl },
    description: story.description,
    recipeIngredient: ["1 cup sugar", "2 cups flour", "1 cup chocolate chips"],
    recipeInstructions: [
      {
        "@type": "HowToStep",
        text: "Preheat the oven to 350 degrees F.",
      },
      {
        "@type": "HowToStep",
        text: "Mix the sugar and flour.",
      },
      {
        "@type": "HowToStep",
        text: "Add the chocolate chips and bake for 10 minutes.",
      },
    ],
    recipeYield: "24 cookies",
    prepTime: "PT20M",
    cookTime: "PT10M",
    totalTime: "PT30M",
    nutrition: {
      "@type": "NutritionInformation",
      calories: "200 calories",
    },
  };
}
