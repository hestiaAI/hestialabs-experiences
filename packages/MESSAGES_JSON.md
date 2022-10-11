Specification for `messages.json` internationalization file for message translations:

```json
{
  "[lang]": {
    "intro": {
      "title": "Title",
      "subtitle": "Subtitle (optional)",
      "dataPortal": "https://example.com/[lang]/download-my-data/",
      "dataPortalHtml": "<div>Alternative to dataPortal. Used to describe how to download the data if no link is available. Useful to explain how to download data from a mobile app. Supports HTML syntax.</div>",
      "dataPortalMessage": "<div>Additional hints to the user. For example, used to remind the user to download their data in JSON format. Supports HTML syntax.</div>"
    },
    "viewBlocks": {
      "[viewBlockName]": {
        "title": "View Block Title",
        "text": "View Block Description",
        "vizProps": {
          "[someProp]": "Property passed down to the visualization component (not auto-translated unless specified in the messages field below.)",
          "messages": {
            "[someMessage]": "Message to pass on to the visualization. Does not support formattable messages, please put those directly under vizProps."
          }
        },
        "headers": {
          "[someHeader]": "Table header name"
        }
      }
    }
  }
}
```
