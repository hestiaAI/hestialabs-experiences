# Run this example

Navigate to this working directory and then run:

```sh
python -m http.server
```

For an experience, go to http://localhost:8000
For a chart, see http://localhost:8000/chart.html

These examples fetch the latest published data-experience from npm.

## Run the examples with a local build

In this folder's [index.html](index.html) and/or [chart.html](chart.html), **uncomment** the line

```html
<!-- <script src="/dist/DataExperience.umd.js"></script> -->
```

and **comment** the import from the cdn (it could unpkg rather than jsdelivr)

```html
<script src="https://cdn.jsdelivr.net/npm/@hestia.ai/data-experience/dist/DataExperience.umd.min.js"></script>
```

Then build and run from the root of the data-experience project

```sh
cd ..
npm run build
python -m http.server

```

For an experience, go to http://localhost:8000/deployment-examples/html-plain
For a chart, see http://localhost:8000/deployment-examples/html-plain/chart.html
