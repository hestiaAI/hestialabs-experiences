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
   * Override default locale
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
  "mapboxToken": "string",
  /**
    * The public key used to encrypt the zip containing the consent log and results. Public and private key pairs can be generated at https://experiences.hestialabs.org/import/
    * @type String
    */
  "publicKey": "29500a8814ffbfbb3fda7e9854ab8319e349dd50c1fe018ac342300d52f47626",
  /**
    * The content of the consent form. A default form can be defined, but it can be overriden for a specific experience.
    * Keys can be "default" or "[name-of-overriding-experience]"
    * We can also hide this section for a specific experience by setting it to null.
    * Each section can have:
    * - "title"
    * - "description"
    * - "type" (optional):
    *   - type "data" (exactly one required):
    *     - "hide": do we hide the checkboxes ?
    *     - "value": an array of pre-selected results (or implicitly added data if the checkboxes are hidden),
    *       where results are addressed using the key of the sub-experience
    *   - type "radio":
    *     - "options": an array of options
    *     - "value": a pre-selected answer (as a string)
    *   - type "checkbox":
    *     - "options": an array of options
    *     - "value": an array of pre-selected answers
    *   - type "input" and "multiline":
    *     - "name": the label of the text field
    *     - "placeholder" (optional): some placeholder text
    *     - "value" (optional): some initial text
    * - "required" (optional): whether or not an answer is required (Boolean, but can also be an array of keys for the data section).
    * @type Object
    */
  "consent": {
    "default": [
      {
        "title": "Introduction",
        "description": "This is an example consent form."
      },
      {
        "description": "Please input some information.",
        "type": "input",
        "name": "e-mail"
      },
      {
        "title": "Radio buttons",
        "description": "Please select one option.",
        "type": "radio",
        "options": ["A", "B"],
        "value": "A"
      },
      {
        "title": "Checkboxes",
        "description": "Please select all options that apply.",
        "type": "checkbox",
        "options": ["X", "Y", "Z"],
        "value": ["X"]
      },
      {
        "title": "Which data should be shared ?",
        "description": "The visualizations of every checked section will be reproducible and the underlying data will be available to the receiver (at least one required).",
        "type": "data",
        "required": true
      },
      {
        "title": "Multi-line text area",
        "type": "multiline",
        "placeholder": "Please type your comment"
      }
    ],
    "tracker-control": [
      {
        "title": "Tracker control export",
        "description": "This is a special consent form for tracker-control. The data must be included."
      },
      {
        "type": "data",
        "hide": true,
        "value": ["trackerControl"],
        "required": ["trackerControl"]
      }
    ],
    "facebook": null
  }
}
```
