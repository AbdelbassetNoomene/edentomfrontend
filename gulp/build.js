'use strict';

var path       = require('path');
var gulp       = require('gulp');
var conf       = require('./conf');
var gutil      = require('gulp-util');
var jshint     = require('gulp-jshint');
var replace    = require('gulp-replace-task');
var fs         = require('fs');
var ngConstant = require('gulp-ng-constant');

var $ = require('gulp-load-plugins')({
    pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function ()
{
    return gulp.src([
            path.join(conf.paths.src, '/app/**/*.html'),
            path.join(conf.paths.tmp, '/serve/app/**/*.html')
        ])
        .pipe($.htmlmin({
            collapseWhitespace: true,
            maxLineLength     : 120,
            removeComments    : true
        }))
        .pipe($.angularTemplatecache('templateCacheHtml.js', {
            module: 'edentom',
            root  : 'app'
        }))
        .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function ()
{
    var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {read: false});
    var partialsInjectOptions = {
        starttag    : '<!-- inject:partials -->',
        ignorePath  : path.join(conf.paths.tmp, '/partials'),
        addRootSlash: false
    };

    var cssFilter = $.filter('**/*.css', {restore: true});
    var jsFilter = $.filter('**/*.js', {restore: true});
    var htmlFilter = $.filter('*.html', {restore: true});

    return gulp.src(path.join(conf.paths.tmp, '/serve/*.html'))
        .pipe($.inject(partialsInjectFile, partialsInjectOptions))
        .pipe($.useref())
        .pipe(jsFilter)
        .pipe($.sourcemaps.init())
        .pipe($.ngAnnotate())
        .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
        .pipe($.rev())
        .pipe($.sourcemaps.write('maps'))
        .pipe(jsFilter.restore)
        .pipe(cssFilter)
        .pipe($.sourcemaps.init())
        .pipe($.cleanCss())
        .pipe($.rev())
        .pipe($.sourcemaps.write('maps'))
        .pipe(cssFilter.restore)
        .pipe($.revReplace())
        .pipe(htmlFilter)
        .pipe($.htmlmin({
            collapseWhitespace: true,
            maxLineLength     : 120,
            removeComments    : true
        }))
        .pipe(htmlFilter.restore)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')))
        .pipe($.size({
            title    : path.join(conf.paths.dist, '/'),
            showFiles: true
        }));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function ()
{
    return gulp.src($.mainBowerFiles())
        .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
        .pipe($.flatten())
        .pipe(gulp.dest(path.join(conf.paths.dist, '/fonts/')));
});

gulp.task('other', function ()
{
    var fileFilter = $.filter(function (file)
    {
        return file.stat.isFile();
    });

    return gulp.src([
            path.join(conf.paths.src, '/**/*'),
            path.join('!' + conf.paths.src, '/**/*.{html,css,js,scss}')
        ])
        .pipe(fileFilter)
        .pipe(gulp.dest(path.join(conf.paths.dist, '/')));
});

gulp.task('clean', function ()
{
    return $.del([path.join(conf.paths.dist, '/'), path.join(conf.paths.tmp, '/')]);
});

/**
 * configure the jshint task
 */
gulp.task('jshint', function() {
  return gulp.src(path.join(conf.paths.src, '/app/**/*.js')) //gulp.src('source/javascript/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

/**
 * extract the app version from bower.json
 */
gulp.task('appVerion', function() {

	// get version from bower file
    var bower = require('../bower.json');
    // set version to ng contants
    var constants = { APP_VERSION: bower.version };
    gutil.log('--> Application Version: ' + JSON.stringify(constants));

    return ngConstant({ constants: constants,
                        stream: true,
                        name: 'app.version'
                      })
           // save ngConstant.js to src/app/
           .pipe(gulp.dest(path.join(conf.paths.src, '/app')));
});

/**
 * replace the 'apiUrl' constant in the api-url.constant.js script
 */
var replaceUrl = function(replacement) {
	return gulp.src(path.join(conf.paths.conf, '/api-url.constant.js'))
               .pipe(replace({	// replace the placeholder @@apiUrl with the correct value
                   patterns: [{
                       match: 'apiUrl',
                       replacement: replacement
                   }]
               }))
               .pipe(gulp.dest(path.join(conf.paths.src, '/app/main/authentication/constants/')));
};

/**
 * set url for the right environment
 */
var setUrl = function(environment) {
	var server = JSON.parse(fs.readFileSync(path.join(conf.paths.conf, '/environments/' + environment + '-server.json')));
	gutil.log('--> server.apiUrl = ' + server.apiUrl);
	return replaceUrl(server.apiUrl);
};
gulp.task('set-dev-url', function() {
	return setUrl('dev');
});
gulp.task('set-test-url',  function() {
	return setUrl('test');
});
gulp.task('set-live-url',  function() {
	return setUrl('live');
});
gulp.task('set-local-url', function() {
	return setUrl('local');
});

/**
 * configure the set-backend-url task
 */
gulp.task('set-api-url', function() { //window
	//window.__env = window.__env || {};
	//window.__env.apiUrl = gutil.env.apiUrl;
	gutil.log('--> The giving parameter is apiUrl = ' + gutil.env.apiUrl);

	return replaceUrl(gutil.env.apiUrl);
});

gulp.task('build-for-server-url',   ['set-api-url',   'appVerion', 'html', 'fonts', 'other']);

gulp.task('build-for-dev-server',   ['set-dev-url',   'appVerion', 'html', 'fonts', 'other']);
gulp.task('build-for-test-server',  ['set-test-url',  'appVerion', 'html', 'fonts', 'other']);
gulp.task('build-for-live-server',  ['set-live-url',  'appVerion', 'html', 'fonts', 'other']);
gulp.task('build-for-local-server', ['set-local-url', 'appVerion', 'html', 'fonts', 'other']);

gulp.task('build', ['build-for-local-server']);