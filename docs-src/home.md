*This library is part of the [Malibu Framework](https://developers.quintype.com/malibu)*.

The Quintype seo plugin handles most of the SEO tags that Quintype publishers usually add as a best practice. This includes
* Adding the AMP tags for story pages if enabled
* Ensuring Article / NewsArticle schemas are present if enabled
* Ensuring og images and other social sharing tags are present

The *@quintype/seo* library works by passing the page related data to a series of functions of type {@link Generator}. Each one will return some tags, which is finally converted to HTML tags.

This should already be implemented for you in the malibu app. However, each generators accepts parameters which can configure which tags are generated. Please see the {@link SEO} class and each individual {@link Generator} for a list of parameters that are accepted.

There is also a [Malibu Tutorial](https://developers.quintype.com/malibu/tutorial/custom-seo) on extending this plugin.
