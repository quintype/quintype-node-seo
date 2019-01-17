export const getSchemaContext = { "@context": "http://schema.org" }

export function getSchemaType(type) {
  return { "@type": type };
}

export function getSchemaPerson(name) {
  return Object.assign({},
    getSchemaType("Person"),
    {
      "givenName": name,
      "name": name
    }
  )
}

function stripMillisecondsFromTime(date) {
  const toReturn = date.toJSON();
  if(!toReturn)
    return toReturn;
  return toReturn.split('.')[0]+"Z";
}

export function getSchemaBlogPosting(card = {}, author = {}, headline = '', image = '', structuredData = {}, story = {}) {
  const {website : {url = ''} = {}} = structuredData;
  return Object.assign({},
    getSchemaType("BlogPosting"),
    getSchemaMainEntityOfPage(`${url}/${story.slug}`),
    getSchemaPublisher(structuredData.organization),
    {
      "dateModified": stripMillisecondsFromTime(new Date(card['card-updated-at'])),
      "dateCreated": stripMillisecondsFromTime(new Date(card['card-added-at'])),
      "datePublished": stripMillisecondsFromTime(new Date(card['card-updated-at'])),
      "author": author,
      "headline": headline,
      "image": image
    }
  );
}

export function getSchemaPublisher(organization) {
  return {
    "publisher": Object.assign({},
      getSchemaType("Organization"),
      getSchemaContext,
      organization
    )
  }
}

export function getSchemaMainEntityOfPage(id) {
  return {
    "mainEntityOfPage": Object.assign({},
      getSchemaType("WebPage"),
      {"@id": id }
    )
  }
}

export function getSchemaWebsite(website = {}) {
  return Object.assign({},
    getSchemaContext,
    getSchemaType("WebSite"),
    {
      "url": website.url,
      "potentialAction": {
        "@type": "SearchAction",
        "target": `${website.url}/${website.searchpath}`,
        "query-input": website.queryinput
      }
    }
  )
}
