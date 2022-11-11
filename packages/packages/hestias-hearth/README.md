# Hestia’s Hearth

## Installation and Usage

Install via npm:

```bash
npm i -g "@hestia.ai/hestias-hearth"
```

Run `hestias-hearth` script:

```bash
hestias-hearth fire twitter -f "C:\Users\me\hestialabs-experiences\packages\lib\data-samples\twitter-small.zip"
```

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
