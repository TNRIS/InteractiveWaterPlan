# InteractiveStateWaterPlan App

AngularJS (client-side app) files are in `application/client/`

Express (server-side app) files are in `application/server/`

## Initial setup

First make sure these are installed:
 - nodejs
 - ruby and rubygems (gem usually comes with ruby but might not on some
   platforms, depending on how it is installed)
 - compass (`gem install compass`)

Download the sqlite database `cache.db` from https://s3-us-west-2.amazonaws.com/tnris-misc/iswp/cache.db and place it in `application/server/cache/`

The spatial features for all of the existing supplies and proposed supplies can be found in the TNRIS CartoDB account: https://tnris.cartodb.com/tables/iswp_sourcefeatures/public 

## Developing

1. Install `nodemon` and `gulp` globally: `npm install -g nodemon gulp`
2. Navigate to `application/` and run `npm install`
3. In one terminal, run `gulp` to build and watch sources for changes.
4. In another terminal run `npm start` to launch the app server.

`gulp dist` will perform a single build of the app. The `/dist` directory will contain the built application.

## Production Build

1. Navigate your terminal to `application/`.
1. `npm run production-dist` to make a production build.
1. `NODE_ENV=production npm start` to start the production app server.

