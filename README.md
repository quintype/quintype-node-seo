# quintype-node-seo
SEO modules for the malibu app

## Configuration

```javascript
new SEO({
  staticTags: {
    "twitter:site": "Quintype",
    "twitter:domain": "quintype.com",
    "twitter:app:name:ipad": "Quintype",
    "twitter:app:name:googleplay": "Quintype (Official App)",
    "twitter:app:id:googleplay": "com.quintype",
    "twitter:app:name:iphone": "Quintype for iPhone",
    "twitter:app:id:iphone": "42",
    "apple-itunes-app": "app-id=42",
    "google-play-app": "app-id=com.quintype",
    "fb:app_id": "42",
    "fb:pages": "42",
    "og:site_name": "Quintype"
  },
  enableTwitterCards: true,
  enableOgTags: true,
  enableNews: true,
  structuredData: {
    organization: {
      name: "Quintype",
      url: "http://www.quintype.com/",
      logo: "https://quintype.com/logo.png",
      sameAs: ["https://www.facebook.com/quintype","https://twitter.com/quintype_in","https://plus.google.com/+quintype","https://www.youtube.com/user/Quintype"],
    },
    enableNewsArticle: true
  },
  ampStoryPages: true  // Valid options are true (default), false, and "public"
});
```

## Where does my tags come from?

### Image Tags

Image tags come from the hero image of a story (data.story.hero-image). If a cardId was passed, the card's hero image is picked. If a collection is passed, then the images come from the cover image of the collection (data.collection.metadata.cover-image).

### Page Type Aliases

Sometimes, a page will have the same SEO characteristics as another page, but required different data loading logic. For example, a particular section may have some extra data, and a completely different layout.

In this case, the preferred solution is to use a different PAGE_TYPE, and the pass the following flags to the SEO module.

```javascript
new SEO({
  pageTypeAliases: {
    "awesome-page": "section-page"
  }
})
```
### Entity Tags

If story has any entity associated in the story-attributes, StructuredDataTags will be generated for those entities. Right now we are doing it only for movie.
To generate the Entity Tags, while executing getMetaTags on the SEO instance, the data argument should look like:
```
  data : {
    story:<storyObject>,
    linkedEntities: [
      <EntityObjects for all the associated entities>
    ]
  }
```
data Object should have a key called "linkedEntities" and the value should be an array of all Entities.
Please also refer to the test case "Structured DataTags for Entity" in structured_data_tags_test

### Structured data

The `structuredData` option to SEO class expects a config like:
```
structuredData: {
    organization: <orgObject>,
    website: <websiteObject},
    footer: <footerObj>
    header: <headerObj>,
    enableLiveBlog: true,
    enableNewsArticle: true,
    enableBreadcrumbList: false
  },
 ```
 and `node-seo` will inject appropriate structured data in LD-JSON format in the `<head>`. Following are some sample config values for `structuredData` values.

#### Organization

`Organization` schema will only available in home page.

Sample object:
```
organization: {
    name: 'Bloomberg Quint',
    url: 'https://www.bloombergquint.com/',
    logo: 'https://www.bloombergquint.com/bq-logo.png',
    sameAs: [
      'https://www.facebook.com/bloombergquint',
      'https://twitter.com/BloombergQuint',
      'https://www.linkedin.com/company/bloombergquint',
      'https://www.youtube.com/c/BloombergQuintNews',
      'https://www.instagram.com/bloombergquint'
    ]
  }
```
#### website
Sample object:
```
website: {
    url: 'https://www.bloombergquint.com/',
    searchpath: 'search?q={q}',
    queryinput: 'required name=q',
    name: 'Bloomberg Quint',
    headline: 'Bloomberg Quint - Discover news',
    keywords: 'bloombergquint,news,quintype'
  }
  ```

#### WPHeader and WPFooter

```
footer: {
    cssSelector: '#bq-footer'
  },
  header: {
    cssSelector: '#bq-header'
  }
 ```

#### NewsArticle and Article schema

Pass the `<value>` to enableNewsArticle to enable `NewsArticle`.

```
structuredData: {
    ...
    enableNewsArticle: <value>
  },
 ```
Possible values and outcome:

| value                  | type   | result                                         |   |   |
|------------------------|--------|------------------------------------------------|---|---|
| false                  | bool   | Only Article will be available                 |   |   |
| true                   | bool   | Both Article and NewsArticle will be available |   |   |
| "withoutArticleSchema" | string | Only NewsArticle will be available             |   |   |

#### BreadcrumbList

`BreadcrumbList` is enabled by default. Pass the `<value>` as `false` explicitly to disable it.

```
structuredData: {
    ...
    enableBreadcrumbList: <value>
  },
 ```

 Possible values and outcome:

| value                  | type   | result                                         |   |   |
|------------------------|--------|------------------------------------------------|---|---|
| false                  | bool   | BreadcrumbList Schema will not be available    |   |   |
| true                   | bool   | BreadcrumbList Schema will be available        |   |   |

### Example Usage (v1.5.0 and above)

```javascript
import {SEO, generateStaticData, generateStructuredData} from "@quintype/seo";

function generateSeo(config) {
  return new SEO({
    staticTags: generateStaticData(config),
    structuredData: generateStructuredData(config),
    enableTwitterCards: true,
    enableOgTags: true,
    enableNews: true
  })
}
```

### Note

If the ```URL``` is undefined, please bump up the node version > 8.
