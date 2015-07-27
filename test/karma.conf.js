module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve all patterns, eg. files, exclude
        basePath: '..',

		// frameworks to use
        frameworks: ['jasmine'],

        files: [
        	'bower_components/angular/angular.js',
        	'bower_components/angular-mocks/*.js',
        	'bower_components/supersonic/*.js',
        	'app/**/*.js',
        	'app/**/*.html',
        	'test/consumer/scripts/*.js',
        	'test/example/scripts/*.js'
        ],

        plugins: [
            'karma-jasmine',
            'karma-coverage',
            'karma-phantomjs-launcher',
        ],

        browsers: [
            'PhantomJS'
        ],

        reporters: ['progress'],

        colors: true,
        logLevel: config.LOG_INFO,
        singleRun: true,
        autoWatch: false
    });
};
