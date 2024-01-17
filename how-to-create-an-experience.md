
# How to create an experience  

An experience is a visualization of personal data collected by a company on a user.

For an overview of the system see the [README](README.md)

An experience lives in the subproject *packages*. For example [instagram is here](packages/packages/experiences/instagram). You can see all the parts of the experience in the [src/index.ts](packages/packages/experiences/instagram/src/index.ts) file.

It's made up of **loader options** and **viewer options**. The loader options contain the code. The viewer options can be changed by the developer who uses this package. There are default viewer options in file [src/instagram-viewer.json](packages/packages/experiences/instagram/src/instagram-viewer.json)

## Running an experience in developement mode

The experience are run in the project *data-experience*. You first need to follow the setup instructions in the  [README](data-experience/README.md)

To run it go to folder *data-experience* and 

``` sh
cd ../data-experience
npm run dev
```

This will open a developement view of the experiences. The app is defined in file [data-experience/dev/App.vue](data-experience/dev/App.vue). To make your life easier while developing the instagram, make it the initialExperience in App.vue:

``` javascript
// const initialExperience = 'uber-driver'
const initialExperience = 'instagram'
```

You can also change the default locale to english:

``` javascript
  // i18nLocales: ['fr', 'en'],
  i18nLocales: ['en', 'fr'],
```

The web page should instantly reflect your change.

## Viewer options (instgram-viewer.json)
The experience's viewer options are taken from the folder *data-experience/public*. The instagram viewer options are in [data-experience/public/instagram-viewer.json](data-experience/public/instagram-viewer.json)

Change the property "dataPortalMessage":

``` json
"dataPortalMessage": "<strong>VERY VERY Important:"
```

The change should be reflected automatically on your web page.

If you want to test the default viewer.json, rename or delete *data-experience/public/instagram-viewer.json*. Then you need to stop and restart your server.

``` sh
npm run dev
```

Now changes in instagram experience's default [instagram-viewer.json](packages/packages/experiences/instagram/src/instagram-viewer.json) should be reflected automatically on the web page.

(Don't bother about the *messages.json* file in the instagram experience; its content has been copied into *instagram-viewer.json* and it's almost certainly no longer being used anywhere).

The tabs in the experience are configured by the root property *viewBlocks* in the viewer.json. Try to remove one. Note: under the property *messages* there are other *viewBlock* properties which only affect the text that a tab displays.

 ``` json
  "viewBlocks": [
    {
      "showTable": false,
      "id": "consumption",
      "sql": "SELECT accountName, datetime AS actionDate, 'Post Viewed' AS actionType FROM InstagramPostViewed UNION SELECT accountName, datetime AS actionDate, 'Video Watched' AS actionType FROM InstagramVideoWatched UNION SELECT accountName, datetime AS actionDate, 'Ad Viewed' AS actionType FROM InstagramAdViewed; ",
      "files": ["postsViewed", "videosWatched", "adsViewed"],
      "visualization": "ChartViewDashboard.vue",
      "vizProps": {
        "graphs": [
          {
            "title": "Content viewed",
            "valueLabel": "views",
            "cols": "12",
            "type": "TimelineChart.vue",
            "dateAccessor": "actionDate"
          },
          {
            "valueLabel": "interactions",
            "title": "Type of content",
            "cols": "6",
            "height": 220,
            "type": "PieChart.vue",
            "valueAccessor": "actionType"
          },
          {
            "valueLabel": "interactions",
            "title": "Top Account",
            "cols": "6",
            "height": 220,
            "type": "TopChart.vue",
            "isScrollable": true,
            "topK": 100,
            "valueAccessor": "accountName"
          }
        ]
      },
      "title": "Consumption",
      "text": "See how much content you watch over time."
    },
 
 ```

Looking at the viewBlock of the first tab *consumption* you notice:
- **files** are the files needed in the user's data for displaying this tab. If one is missing, an error is shown to the user.
- **sql** is a request on a database created by the experience's pipeline.
- **vizualization** tells the experience what visualization component to use. In this case it's [chart/view/ChartViewDashboard.vue](data-experience/src/components/chart/view/ChartViewDashboard.vue).

The visualization components are a part of *data-experience*, the experiences only refer to them by name. The visualization is configured by vizProps that depend on the type of the visualization component. ChartViewDashboard.vue can contain graphs that are also components like [chart/view/dc/TimelineChart.vue](data-experience/src/components/chart/view/dc/TimelineChart.vue). I suspect that only components in the dc folder can be used inside the dashboard.
 
## Loader options 

