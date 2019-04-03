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
  ampStoryPages: true
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

### Structured data

The `structuredData` option to SEO class expects a config like:
```
structuredData: {
    organization: <orgObject>,
    website: <websiteObject},
    footer: <footerObj>
    header: <headerObj>,
    enableLiveBlog: true,
    enableNewsArticle: true
  },
 ```
 and `node-seo` will inject appropriate structured data in LD-JSON format in the `<head>`. Following are some sample config values for `structuredData` values.

#### Organization

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
    queryinput: 'required name=q'
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
