This directory contains the configuration files linked to each deployement. They expect the following grammar:

```js
{
  /**
    * The name of the experiences to display (as defined in `/manifests/experiences/`).
    * @type Array
    */
  "experiences": ["facebook", "google", "twitter"],
  /**
    * The public key used to encrypt the zip containing the consent log and results.
    * @type String
    */
  "publicKey": "29500a8814ffbfbb3fda7e9854ab8319e349dd50c1fe018ac342300d52f47626",
  /**
    * The content of the consent form. Each section can have:
    * - A title
    * - A description
    * - A type (Either 'radio' or 'checkbox' or 'input')
    *   - For type 'radio': an array of options and a pre-selected answer (use the empty string for no pre-selection)
    *   - For type 'checkbox': an array of options and an array of pre-selected answers (use the empty array for no pre-selection)
    *   - For type 'input': the name (label) of the input field
    * - Whether or not an answer is required (works for all types).
    * @type Array
    */
  "consent": [
    {
      "title": "Introduction",
      "description": "This is an example consent form."
    },
    {
      "description": "Please input some information",
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
  ]
}
```
