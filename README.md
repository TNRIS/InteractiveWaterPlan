# Interactive State Water Plan App

The [Interactive State Water Plan](http://texasstatewaterplan.org/) (ISWP) application displays water planning data for the State of Texas from the [2012 State Water Plan](http://www.twdb.texas.gov/waterplanning/swp/2012/). The ISWP is a single-page app. Its back-end [API](http://texasstatewaterplan.org/api/v1) is built with [Express](http://expressjs.com/) and the front-end is built with [AngularJS](https://angularjs.org/) and [Leaflet](http://leafletjs.com/).

The ISWP keeps a snapshot of relevant State Water Plan data in a local SQLite database.

Front-end code is in `application/client/`

Back-end code is in `application/server/`

## Initial setup

First make sure these are installed:
 - [nodejs](https://nodejs.org/)
 - [ruby](https://www.ruby-lang.org/en/) and [rubygems](https://rubygems.org/pages/download)
 - compass (`gem install compass`)

Download the SQLite database `cache.db` from https://s3-us-west-2.amazonaws.com/tnris-misc/iswp/cache.db and place it in `application/server/cache/`

The spatial features for all of the existing supplies and proposed supplies can be found in the TNRIS CartoDB account: https://tnris.cartodb.com/tables/iswp_sourcefeatures/public 

## Developing

1. Install `nodemon` and `gulp` globally: `npm install -g nodemon gulp`
2. Navigate to `application/` and run `npm install`
3. In one terminal, run `gulp` from `application/` to build and watch sources for changes.
4. In another terminal run `npm start` from `application/` to launch the app server.

`gulp dist` will perform a single build of the app. The `/dist` directory will contain the built application.

## Production Build

1. Navigate your terminal to `application/`.
1. `npm run production-dist` to make a production build.
1. `NODE_ENV=production npm start` to start the production app server.


## About

The ISWP is a product of the [Texas Water Development Board](http://www.twdb.texas.gov/) and was built internally by the [Texas Natural Resources Information System](http://tnris.org) division.

For more information about the application, visit http://texasstatewaterplan.org/about

