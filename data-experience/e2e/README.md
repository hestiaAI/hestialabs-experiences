[DOCUMENTATION](https://playwright.dev/docs/intro)

## Run the test
```
npx playwright test
```

## Create a new test using screen recording
```
npx playwright codegen playwright.dev
```

## Screenshot tests

`visual/experiences.spec.js` loads each listed experience with its sample from `packages/lib/data-samples/`, then compares a screenshot of every tab with the one in `visual/__screenshots__/`. It covers English and French, on desktop (1280 px wide) and phone (Pixel 5).

```sh
npm run setup                     # at the repository root: packages built, data-experience installed
cd data-experience
npm run test:visual               # compare
npm run test:visual -- --update-snapshots   # after an intended change: replace the screenshots
npm run test:visual -- -g tracker-control --project desktop   # any other Playwright option
```

Notes:
- **Docker is required.** `scripts/visual-tests.sh` takes the screenshots in the official Playwright image, at the `@playwright/test` version in `package-lock.json`. The browser and fonts are then the same everywhere, so screenshots taken on one machine match in CI.
- **The dev app** (`dev:app`, port 8080) runs on your machine. The script starts it if it isn't running; if it is, the script uses it.
- **No network.** `fixtures.js` serves the samples, Roboto and the CDN assets locally.
- **A failed comparison** writes the expected, actual and diff images to `test-results/`. In CI, they are uploaded as the `visual-differences` artifact.
- **When a screenshot changes,** commit the new one in the same PR and say in the description what changed and why. A refactor must leave every screenshot unchanged (see `AGENTS.md`).

To add an experience:
1. Add it, with its sample, to the list at the top of `visual/experiences.spec.js`.
2. Run `npm run test:visual -- --update-snapshots -g <slug>`.
3. Look at every new image before committing it.
