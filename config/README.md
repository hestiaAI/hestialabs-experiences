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
    * The content of the consent form. Each section has:
    * - A title
    * - A description
    * - A type (Either 'radio' or 'checkbox' or nothing)
    * - An array of options
    * - A pre-selected answer (or an array of pre-selected answers in the case of checkboxes).
    *   Use an empty string or empty array for no pre-selection.
    * @type Array
    */
  "consent": [
    {
      "title": "Interesting title 1",
      "description": "Lorem ipsum"
    },
    {
      "title": "Interesting title 2",
      "description": "Lorem ipsum",
      "type": "radio",
      "options": ["A", "B", "C"],
      "selected": "A"
    },
    {
      "title": "Interesting title 3",
      "description": "Lorem ipsum",
      "type": "checkbox",
      "options": ["A", "B", "C"],
      "selected": []
    },
  ]
}
```
