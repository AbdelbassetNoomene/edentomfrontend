/**
 *  Welcome to your gulpfile!
 *  The gulp tasks are splitted in several files in the gulp directory
 *  because putting all here was really too long
 */

'use strict';

var gulp = require('gulp'),
 gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins({
                        rename: {
                          'gulp-htmlmin' : 'minhtml',
                          'gulp-foreach' : 'foreach'
                        }
                      }),
 wrench = require('wrench');

/**
 *  This will load all js or coffee files in the gulp directory
 *  in order to load all gulp tasks
 */
wrench.readdirSyncRecursive('./gulp').filter(function(file) {
  return (/\.(js|coffee)$/i).test(file);
}).map(function(file) {
  require('./gulp/' + file);
});


/**
 *  Default task clean temporaries directories and launch the
 *  main optimization build task
 */
/* gulp.task('heroku:production');*/
/* gulp.task('default', ['clean'], function () {
  gulp.start('build');
});*/
gulp.task('heroku:production', function(){
  gulp.task('serve',['clean', 'build']);
})

/*gulp.task('heroku:production', ['clean',  'build']);*/
/*gulp.task('serve', function() {
  $.connect.server({
    root: '',
    port: process.env.PORT || 5000,
    livereload: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined ? true : false
  });

  if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined)
    $.exec('open http://localhost:5000');
});*/
/*gulp.task('serve',['assemble'],function() {
  $.connect.server({
    root: '0.0.0.0',
    port: process.env.PORT || 5000, 
    livereload: false
  });
});
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === undefined) {
  gulp.task('default', [  'serve']);
} else {
  gulp.task('default', [ 'serve']);
}
*/
