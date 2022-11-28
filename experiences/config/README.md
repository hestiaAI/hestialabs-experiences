This directory contains the configuration files linked to each deployment. They expect the following grammar:

```js
{
  /**
   * Override link to home page (absolute path to an external home page)
   * @type String
   */
  "homePath": "/index.html"
  /**
   * Vuetify (light) theme colors to override defaults in vuetify.options.js
   * @type Object
   */
  "theme": {
    "primary": "#0C2D48",
    "secondary": "#2E8BC0"
  },
  /**
   * URL to fetch 3rd party translations
   * @type String
   */
  "i18nUrl": "https://example.com/translations.json",
  /**
   * Set default locale
   * @type String
   */
  "i18nLocale": "en",
  /**
   * Override list of available locales
   * @type Array
   */
  "i18nLocales": ["fr"],
  /**
    * Name followed by the version tag of each experience to include.
    * Format: <name>@<tag>
    * If the <tag> is omitted, "latest" will be used.
    * @type Array
    */
  "experiences": ["facebook", "google", "twitter@1.0.0"],
  /**
    * The hashtags that are pre-written when using the Twitter "Share" button.
    * @type Array
    */
  "hashtags": ["dataprivacy", "hestialabs"],
  /**
    * Display the logos of experience collaborators (such as eyeballs, dating privacy)
    * @type Boolean
    */
  "displayCollaborators": true,
  /**
    * Links to existing pages to display in the app bar.
    * This are valid site wide and cannot be configured in bubbles.
    * @type Array
    */
  "appBarLinks": [
    { "url": "/about", "name": "About" },
    { "url": "/privacy", "name": "Privacy" }
  ],
  /**
    * The bubbles that are included in this website.
    * @type Array
    */
  "bubbles": ["workshop-x-participant", "workshop-x-aggregator"],
  /**
    * Bubbles that are displayed on the home page (not on the menu).
    * Must be included in the "bubbles" above.
    * @type Array
    */
  "homePageBubbles": ["workshop-x-participant"],
  /**
    * A link to a filedrop service. In case the size limit is exceeded,
    * the user is invited to download the ZIP and use this link.
    * @type String
    */
  "filedrop": "https://example.com/filedrop",
  /**
    * Path or URL to override the default site logo
    * @type String
    */
  "logo": "/some-other-logo.png",
  /**
    * Mapbox Token
    * @type String
    */
  "mapboxToken": "string"
}
```
