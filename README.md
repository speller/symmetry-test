# Symmetry test assignment

Backend: NodeJS

Frontend: React+Redux+Saga+Material-UI

## Installation

`yarn install` - to install all the dependencies.

`npm run watch` - to watch file changes and rebuild backend and test bundles.

`npm run build` - to build production bundles for frontend and backend.

`npm run dev-start` - to start the webpack dev server for local development.

`node build/server.js` - to run local web socket server.

`node node_modules\mocha\bin\mocha build/test.js` - to run unit tests.

Development and production configurations are configured in `js/config/config-dev.json` and `js/config/config-prod.json` 
files respectively. For a few days while the assignment is being checked publicly accessible database will work (no time 
for tuning). After this period it will be closed.

You can find DB schema in the `schema.sql` file.