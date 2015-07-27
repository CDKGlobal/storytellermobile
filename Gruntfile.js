/*

Default Gruntfile for AppGyver Steroids
http://www.appgyver.com
Licensed under the MIT license.

*/

module.exports = function(grunt) {
  grunt.loadNpmTasks("grunt-steroids");
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
  	karma: {
  		unit: {
  			configFile: 'test/karma.conf.js'
  		}
  	}
  })

  grunt.registerTask("default", [
    "steroids-make-fresh"
  ]);

  grunt.registerTask("unittest", ["karma"]);
}
