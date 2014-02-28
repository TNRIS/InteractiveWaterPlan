path = require 'path'

# Build configurations.
module.exports = (grunt) ->
  grunt.initConfig
    # Deletes Compiled script directory
    # These directories should be deleted before subsequent builds.
    # These directories are not committed to source control.
    clean:
      working:
        src: [
          './Scripts/Compiled/*'
        ]
      
    # Compile CoffeeScript (.coffee) files to JavaScript (.js).
    coffee:
      scripts:
        files: [
          cwd: './Scripts/Coffee'
          src: '**/*.coffee'
          dest: './Scripts/Compiled'
          expand: true
          #ext: '.js'
          rename: (dest, src) ->
            name = src.replace('.coffee', '.js')
            return dest + '/' + name
        ]
        options:
          # Don't include a surrounding Immediately-Invoked Function Expression (IIFE) in the compiled output.
          # For more information on IIFEs, please visit http://benalman.com/news/2010/11/immediately-invoked-function-expression/
          bare: true

    # RequireJS optimizer configuration for scripts.
    # This configuration is only used in the 'release' build.
    # The optimizer will scan the main file, walk the dependency tree, and write the output in dependent sequence to a single file.
    # Since RequireJS is not being used outside of the main file or for dependency resolution (this is handled by AngularJS), RequireJS is not needed for final output and is excluded.
    # RequireJS is still used for the default build.
    # The main file is used only to establish the proper loading sequence.
    requirejs:
      app:
        options:
          findNestedDependencies: true
          logLevel: 0
          baseUrl: './Scripts/Compiled/backbone_app'
          paths:
            'scripts': '../..'
            'templates': '../../templates'
          mainConfigFile: './Scripts/Compiled/backbone_app/main.js'
          name: 'main'
          # Exclude main from the final output to avoid the dependency on RequireJS at runtime.
          onBuildWrite: (moduleName, path, contents) ->
            modulesToExclude = ['main']
            shouldExcludeModule = modulesToExclude.indexOf(moduleName) >= 0

            return '' if shouldExcludeModule

            contents
          optimize: 'uglify'
          out: './Scripts/Release/iswp-app.js'
          preserveLicenseComments: true
          skipModuleInsertion: true
          uglify:
            # Let uglifier replace variables to further reduce file size.
            no_mangle: true

    # Sets up file watchers and runs tasks when watched files are changed.
    watch:
      coffee:
        files: './Scripts/Coffee/**'
        tasks: [
          'coffee:scripts'
        ]

  # Register grunt tasks supplied by grunt-contrib-*.
  # Referenced in package.json.
  # https://github.com/gruntjs/grunt-contrib
  grunt.loadNpmTasks 'grunt-contrib-clean'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-requirejs'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Compiles the app with non-optimized build settings.
  # Enter the following command at the command line to execute this build task:
  # grunt
  grunt.registerTask 'default', [
    'coffee:scripts'
  ]


  # Compiles the app with non-optimized build settings and watches changes.
  # Enter the following command at the command line to execute this build task:
  # grunt dev
  grunt.registerTask 'dev', [
    'coffee:scripts'
    'watch'
  ]

  # Compiles the app with optimized build settings.
  # Enter the following command at the command line to execute this build task:
  # grunt release
  grunt.registerTask 'release', [
    'clean:working'
    'coffee:scripts'
    'requirejs:app'
  ]