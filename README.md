# InteractiveStateWaterPlan App

Generated with the [angular-fullstack](https://github.com/DaftMonk/generator-angular-fullstack) Yeoman generator.

Client files are in `src/app/`

Backend files are in `src/lib/`

## Initial setup

First make sure these are installed:
 - nodejs
 - ruby and rubygems (gem usually comes with ruby but might not on some
   platforms, depending on how it is installed)
 - compass (`gem install compass`)

## Building

1. Install `bower` and `grunt` globally: `npm install -g bower grunt`
2. Navigate to `src/` and run `bower install` and `npm install`
3. Now you should be able to use any of the `grunt` tasks defined in `Gruntfile.js`

`grunt serve` will launch express in dev mode and watch files in app/ and lib/

`grunt serve:dist` will launch express in production mode

`grunt build` will build deployable dist\ folder

`grunt` will run tests and build deployable dist\ folder

## Generators

Run generators like so: `yo angular-fullstack:controller MyControllerName`

See [here](https://github.com/yeoman/generator-angular#generators) for generator documentation.

Available generators:

* `angular-fullstack:controller`
* `angular-fullstack:directive`
* `angular-fullstack:filter`
* `angular-fullstack:route`
* `angular-fullstack:service`
* `angular-fullstack:provider`
* `angular-fullstack:factory`
* `angular-fullstack:value`
* `angular-fullstack:constant`
* `angular-fullstack:decorator`
* `angular-fullstack:view`

