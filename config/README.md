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
    * A link to a filedrop service. In case the size limit is exceeded,
    * the user is invited to download the ZIP and use this link.
    * @type String
    */
  "filedrop": "https://example.com/filedrop",
  /**
    * The content of the consent form. A default form can be defined, but it can be overriden for a specific experience.
    * We can also hide this section for a specific experience by setting it to null.
    * Each section can have:
    * - A title
    * - A description
    * - A type (Either 'data', 'radio' or 'checkbox', 'input' or 'multiline')
    *   - For type 'data': a boolean indicating if we hide the checkboxes with all sub-experiences,
    *     an array of implicitly added data (referenced by the key of the sub-experience),
    *     and an array of additional checkboxes.
    *   - For type 'radio': an array of options and a pre-selected answer (use the empty string for no pre-selection)
    *   - For type 'checkbox': an array of options and an array of pre-selected answers (use the empty array for no pre-selection)
    *   - For type 'input' and 'multiline': the name (label) of the text field, and some placeholder text.
    * - Whether or not an answer is required (Boolean, but can also be an array for the data section).
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
        "description": "Please select all options that apply.",
        "type": "checkbox",
        "options": ["X", "Y", "Z"],
        "selected": []
      },
      {
        "title": "Which data should be shared ?",
        "description": "The visualizations of every checked section will be reproducible and the underlying data will be available to the receiver (at least one required).",
        "type": "data",
        "additional": ["Whole file (which I will provide separately)"],
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
        "includedResults": ["trackerControl"],
        "required": ["trackerControl"]
      }
    ],
    "facebook": null
  }
}
```
