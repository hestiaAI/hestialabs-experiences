# Hestia’s Hearth

Hestia’s Hearth is a Node.js command line utility for Hestia’s data processing pipelines.

**Why "Hestia’s Hearth"?**

> In Greek mythology, Hestia is the goddess of the hearth. She takes care of the home, and makes sure the family feels at ease around the house fire to discuss events and ideas. This fire evokes also the fire stolen by Prometheus to be given to humankind. In our frame, this fire is data and data analysis, powerful tools that have escaped from our control. Hestia.ai puts that fire back as a center of our focus, so we can figure out its meaning together, and make sure it serves us rather than put us at risk.
> Reference: [Hestia.ai](https://hestia.ai/en/about/#philosophy)

## Installation and Usage

Install via npm:

```bash
npm i -g "@hestia.ai/hestias-hearth"
```

Run `hestias-hearth` script:

```bash
hestias-hearth fire twitter -f "C:\Users\me\hestialabs-experiences\packages\lib\data-samples\twitter-small.zip"
```

## Output

The script stores all output in the `hestias-hearth` folder in your home directory (`~/hestias-hearth`). On Windows, this will typically be the folder `C:\Users\<user>\hestias-hearth`.

## Development

### Compilation

Run the TypeScript compiler in watch mode:

```sh
npm run dev
```

### Usage

Run the script with Node.js:

**Method 1:**

```sh
npm start -- <arguments>
```

Example command:

```sh
npm start -- fire twitter -f "C:\Users\me\hestialabs-experiences\packages\lib\data-samples\twitter-small.zip"
```

**Method 2:**

Run the Node.js script via the shell script:

```sh
./bin/packages/packages/hestias-hearth/entry.sh <arguments>
```

Example command:

```sh
./bin/packages/packages/hestias-hearth/entry.sh fire twitter -f "C:\Users\me\hestialabs-experiences\packages\lib\data-samples\twitter-small.zip"
```

## Publishing

Build with TypeScript compiler

```sh
npm run build
```

Publish with Lerna

```sh
cd ../../
npm run lerna:version
npm run lerna:publish
```
