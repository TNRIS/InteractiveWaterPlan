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

## Developing

1. Install `nodemon` and `gulp` globally: `npm install -g nodemon gulp`
2. Navigate to `application/` and run `npm install`
3. In one terminal, run `gulp` to watch and build sources. In another terminal run `npm start` to launch the app server.

`gulp` will launch express and watch files for changes

## Building

`gulp dist` will build the app for production. The `/dist` directory will contain the built application.
