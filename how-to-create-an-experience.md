
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

## Viewer options (instagram-viewer.json)
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

### Viewer functions

The second tab in the instagram experience defines a postprocessor.

``` json
    {
      "showTable": false,
      "id": "consumption-time",
      "postprocessor": "makeSessions",
```

The postprocessor refers by name to a function called *makeSessions*. This function needs to be defined in instagram's [index.ts](packages/packages/experiences/instagram/src/index.ts) viewerFunctions. Here they are imported from [viewer-functions.ts](packages/packages/experiences/instagram/src/viewer-functions.ts) which takes makeSessions from postprocessors.ts.

The postprocessor is run on the result of the sql query. It's useful for doing things that are hard in SQL and easy in javascript.

## Loader options 

The loader options in [src/index.ts](packages/packages/experiences/instagram/src/index.ts) define most of the processing done in an experience when you click the button *explore your data*. Here's how they look for instagram:

``` json

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  databaseConfig,
  files: {
    messages: '**/messages/inbox/**/message_*.json',
    followers: '**/followers.json',
    followings: '**/following.json',
    ...
  },
  preprocessors: {
    '**/*.json': preprocessor
  }
}
```

- *files* names the files from the user's zipped data that are needed for this experience. The glob syntax matches files and folders. (The name given to the file here serves as id for the filemanager).
- *databaseConfig* defines how the files are mapped to database tables. Here it imported from *database.ts*
- *preprocessors* defines functions that need to be run on files that match a glob expression. (In instragram, the preprocessor is imported from the neighbouring facebook experience; that is a bad idea, in js you should only import from projects defined in the package.json dependencies.)

### experience without database (uber)

The uber experience has much simpler loader options in its [index.ts](packages/packages/experiences/uber/src/index.ts):

``` typescript
const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  files: {
    trips: '**/Rider/trips_data.csv'
  }
}
```
There are no databaseOptions. The data from uber comes in a csv format which is close enough to what we need for the visualization, so we skip the step where we map the data to a database, populate it and query it with sql. 

## The pipeline 

The pipeline is the process that takes a zip file of the user's data and turns into javascript objects that can be used by a chart component.

To start developing a pipeline, it's useful to run it separately from the whole application in the browser. For this you can use tests.

The tests for the experiencs live in project *data-experience* because it has all the machinery for running them.

``` sh
$ cd data-experience
$ npm run test
...
 PASS  src/__tests__/twitter/database.test.js (60.832 s)
 PASS  src/__tests__/facebook/database.test.js (50.432 s)
 PASS  src/__tests__/twitter-agg/database.test.js (60.768 s)
 PASS  src/__tests__/her/database.test.js
 PASS  src/__tests__/uber/pipeline.test.js
 PASS  src/__tests__/tinder/database.test.js
```

## Example: creating an experience for Wolt

We start with a zip file of a Wolt courier's data. There's one interesting csv file **courier_tasks** with a date in colum *Task completion time*. We would like to display it a bit uber-driver's trips. 

Let's look at the uber-driver experience to find out what charts it's using, in the default values defined in [uber-driver-viewer.json](packages/packages/experiences/uber-driver/src/uber-driver-viewer.json) (in subproject *packages* where the experiences are defined).

It's the second tab of the experience, so it's configured as the second element of the root property *viewBlocks*:

``` json
  "viewBlocks": [
    {
      "id": "driverHeatMap",
      ...
    },
    {
      "id": "driverTrips",
      "customPipeline": "csv_driver_trips",
      "files": ["driver_trips"],
      "title": "Trips",
      "postprocessor": "driverTripsPostProcessor",
      "visualization": "ChartViewDashboard.vue",
      "vizProps": {
        "graphs": [
          {
            "title": "Number of trips",
            "valueLabel": "trips",
            "cols": "12",
            "type": "BarTimelineChart.vue",
            "dateAccessor": "begin_date"
          },
          {
            "valueLabel": "trips",
            "type": "WeekChart.vue",
            "cols": "4",
            "dateAccessor": "begin_date"
          },
          {
            "valueLabel": "trips",
            "type": "HourChart.vue",
            "cols": "4",
            "dateAccessor": "begin_date"
          },
          {
            "valueLabel": "trips",
            "title": "Status of the trip",
            "cols": "4",
            "height": 220,
            "type": "TopChart.vue",
            "valueAccessor": "status"
          }
        ]
      },
      "text": "< TO DEFINE IN TRANSLATIONS >",
      "showTable": false
    },
```

We'll start by creating the first chart. It's a *BarTimelineChart* inside a *ChartViewDashboard*. There is no database, instead there is a *customPipeline* called *csv_driver_trips*. This is named function from a viewer.json, so you can find it's implementation in the experience's [viewer-functions.ts](packages/packages/experiences/uber-driver/src/viewer-functions.ts). 

### Creating the package
Follow the documentation in the [packages README](packages/README.md#create-a-new-package). 

Things you can skip:
- don't bother changing anything in the top-level *experiences* project 
- don't log in to npm yet, that's for later).

#### Creating a test
Before running the experience in the browser, we can execute just it's pipeline in a test. Let's start by copying  [data-experience/src/__tests__/uber/pipeline.test.js](data-experience/src/__tests__/uber/pipeline.test.js) to **wolt/pipeline.test.js**. Also copy **samples.helpers.js**.

The tests should still run.
``` sh
npm run test
```

Replace the first line to import the wolt experience, and check the test now fails.

``` javascript
// import experience from '@hestia.ai/uber'
import experience from '@hestia.ai/wolt
```

Add some anonymized data to *samples.helpers.js*

``` js
export const courierTasks = `"Task creation time ","Task completion time","Is pickup task","Completed with vehicle type","Arrived at","Started at","Arrival time","Departed at"
"2021-04-24 16:19:34.025","2021-04-24 17:13:35.463",TRUE,"BICYCLE","2021-04-24 16:56:59.914","2021-04-24 16:55:03.975","2021-04-24 17:12:54",
"2021-05-07 15:07:02.476","2021-05-07 15:26:22.875",FALSE,"BICYCLE","2021-05-07 15:24:14.696","2021-05-07 15:19:55.534","2021-05-07 15:25:54",
"2021-04-24 16:43:28.318","2021-04-24 17:22:08.96",TRUE,"BICYCLE","2021-04-24 17:20:23.608","2021-04-24 17:17:20.728","2021-04-24 17:21:20",
"2021-04-16 16:36:22.13","2021-04-16 16:48:58.293",TRUE,"BICYCLE","2021-04-16 16:41:59.532","2021-04-16 16:39:45.597","2021-04-16 16:49:34",
"2021-04-24 16:19:34.025","2021-04-24 17:17:17.544",FALSE,"BICYCLE","2021-04-24 17:15:29.318","2021-04-24 17:13:37.043","2021-04-24 17:16:45",
"2021-04-10 11:13:30.969","2021-04-10 11:22:33.466",TRUE,"BICYCLE","2021-04-10 11:19:15.922","2021-04-10 11:15:22.737","2021-04-10 11:22:55",
"2021-04-10 11:13:30.969","2021-04-10 11:33:06.738",FALSE,"BICYCLE","2021-04-10 11:30:46.502","2021-04-10 11:22:36.42","2021-04-10 11:33:41",
"2021-04-13 12:38:15.312",,TRUE,,,,"2021-04-13 12:58:48",
"2021-04-13 12:38:15.312",,FALSE,,,,"2021-04-13 13:19:42",`
```

### Creating a customPipeline

In the wolt experience, add code to the index.ts by copying what you need from the uber-driver experience. You'll need to create viewer options and viewer functions.

``` typescript
import packageJSON from '../package.json'
import viewerFunctions from './viewer-functions'
import { Experience, LoaderOptions, ViewerOptions } from '@/index'
import viewerOptions from './wolt-viewer.json'

const loaderOptions: LoaderOptions = {
  viewerVersion: 1,
  files: {
    courier_tasks: 'courier_tasks.csv'
  }
}

export default new Experience(
  loaderOptions,
  viewerOptions as ViewerOptions,
  packageJSON,
  import.meta.url,
  viewerFunctions
)
```



