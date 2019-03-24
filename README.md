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

## Comments

This project was created fully in modern ES syntax using classes, static fields, imports, etc. To make it working in 
browser and in NodeJS - webpack is used to transpile modern syntax. 

This approach have its own pros and cons for NodeJS, but I decided to do that because I'm more familiar with
modern syntax (code is more simple and clear) and to keep the whole project in the same style for frontend, 
backend and tests.

## TO-DO

- Remove plain text user passwords storage (didn't made it from the beginning to save time).
- Add more unit tests (only one controller was added for demonstration).
- Refactor chat commands processing on the backend side.
- Add new backend service to build message objects when they are transferred to client (current code is duplicated and 
not efficient).

## How to use

1. Go to the deployment page: http://s3-ap-northeast-1.amazonaws.com/symmetry-test/index.html
2. Press the Connect button or use the /join command in chat window.
3. Press the Login button to authorize on the server. Only three users are available:
   - Login: `john`, name: `John Doe`, password: `123` 
   - Login: `taro`, name: `Taro Naka`, password: `123` 
   - Login: `mike`, name: `Mike Smith`, password: `123` - Admin user.
