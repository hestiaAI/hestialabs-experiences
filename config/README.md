This directory contains the configuration files linked to each deployement. They expect the following grammar:

```js
{
  /**
    * The name of the experiences to display (as defined in `/manifests/experiences/`).
    * @type Array
    */
  "experiences": ["facebook", "google", "twitter"],
  /**
    * The hashtags that are pre-written when using the Twitter "Share" button.
    * @type Array
    */
  "hashtags": ["dataprivacy", "hestialabs"],
  /**
    * The public key used to encrypt the zip containing the consent log and results.
    * @type String
    */
  "publicKey": "29500a8814ffbfbb3fda7e9854ab8319e349dd50c1fe018ac342300d52f47626",
  /**
    * The content of the consent form. A default form can be defined, but it can be overriden for a specific experience.
    * We can also hide this section for a specific experience by setting it to null.
    * Each section can have:
    * - A title
    * - A description
    * - A type (Either 'radio' or 'checkbox' or 'input')
    *   - For type 'radio': an array of options and a pre-selected answer (use the empty string for no pre-selection)
    *   - For type 'checkbox': an array of options and an array of pre-selected answers (use the empty array for no pre-selection)
    *   - For type 'input': the name (label) of the input field
    * - Whether or not an answer is required (works for all types).
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
        "selected": "A"
      },
      {
        "title": "Checkboxes",
        "description": "Please select all options that apply (at least one required).",
        "type": "checkbox",
        "options": ["X", "Y", "Z"],
        "selected": [],
        "required": true
      }
    ],
    "twitter": [
      {
        "title": "Twitter export",
        "description": "This is a special consent form for twitter."
      }
    ],
    "facebook": null
  },
  /**
    * If we want to hide the section "Results to include" to the user,
    * the data included in the export can be defined through this field.
    * It is defined for a specific experience, as an array corresponding to the index of the sub-experience (starting from 0).
    * Note that all the included sub-experiences must have been run by the user for the send button to be enabled.
    * @type Object
    */
  "includedResults": {
    "twitter": [2, 3]
  }
}
```
