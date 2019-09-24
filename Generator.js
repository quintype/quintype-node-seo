/**
 * This is the signature of a generator, though this sample generator is unused
 *
 * Please see the following list of generators
 * * {@link TextTags}
 * * {@link ImageTags}
 * * {@link AuthorTags}
 * * {@link StaticTags}
 * * {@link StructuredDataTags}
 * * {@link StoryAmpTags}
 *
 * @param {Object} seoConfig The configuration passed into {@link SEO} class. Please see the individual generators for which properties are used
 * @param {Object} config The configuration object. Please see the [Config API](https://developers.quintype.com/quintype-node-backend/Config.html)
 * @param {string} pageType The page type currently being rendered. Usually something like 'home-page'
 * @param {Object} data The data returned by the *[loadData](https://developers.quintype.com/malibu/isomorphic-rendering#loadData)* function
 * @param {Object} opts Option
 * @param {string} opts.url The current URL being served
 * @return {Object} A map of all tags. ex: `{"og:image": "https://my.domain/image.png"}`
 * @virtual
 */
function Generator(seoConfig, config, pageType, data, { url }) {
}
