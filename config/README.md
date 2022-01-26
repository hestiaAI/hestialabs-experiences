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
