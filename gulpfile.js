var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var autoprefixer = require('autoprefixer');
var postcss = require('gulp-postcss');
var cssgrace = require('cssgrace');
var $ = require('gulp-load-plugins')();
var del = require('del');

var processors = [
    autoprefixer({
      browsers: ['>1%', 'last 2 version', 'ie 6-11']
    }),
    cssgrace
];

var msrc = 'src/mobile/';
var pcsrc = 'src/desktop/';
var mtmp = 'tmp/mobile/';
var pctmp = 'tmp/desktop/';
var mdist = 'dist/mobile/';
var pcdist = 'dist/desktop/';

var mdev_server = 'tmp/mobile/';
var mbuild_server = 'dist/mobile/view/';

var pcdev_server = 'tmp/desktop/';
var pcbuild_server = 'dist/desktop/view/';

var errorHandler = {errorHandler: $.notify.onError("Error: <%= error.message %>")};

gulp.task('clean', function(){
  return del('dist');
});

gulp.task('m-clean', function(){
  return del('dist/mobile');
});

gulp.task('pc-clean', function(){
  return del('dist/desktop');
});

gulp.task('tmp-clean', function(){
  return del('tmp');
});



var htmltask = {
  dev: function(taskname, srcpath, destpath){
    return gulp.task(taskname, function(){
      return gulp.src(srcpath)
      .pipe($.cached())
      .pipe($.plumber(errorHandler))
      .pipe($.htmlhint())
      .pipe($.htmlhint.failReporter({ suppress: true }))
      .pipe(gulp.dest(destpath))
      .pipe($.notify('htmltask success'))
      .pipe(reload({stream:true}));
    });
  },
  build: function(taskname, srcpath, destpath){
      return gulp.task(taskname, function(){
      var options = {
        empty:true,
        collapseBooleanAttributes:true,
        removeComments:true,
        removeEmptyAttributes:true,
        removeScriptTypeAttributes:true,
        removeStyleLinkTypeAttributes:true,
        minifyJS:true,
        minifyCSS:true,
        ignoreCustomFragments: [
         /\{\{[\s\S]*?\}\}/g
        ]
      };
      // <!-- build:css ../style/css/test.min.css -->
      // <!-- endbuild -->

      // <!-- build:css ../style/css/common.min.css -->
      // <!-- endbuild -->

      // <!-- build:js ../js/test.min.js-->
      // <!-- endbuild -->
      
      // <!-- build:js ../js/common.min.js-->
      // <!-- endbuild -->

      return gulp.src(srcpath)
      .pipe($.useref())
      .pipe($.if('*.css', $.cssnano({
            discardComments: {
                removeAll: true
            }
        })))
      .pipe($.if('*.js', $.uglify()))
      .pipe($.htmlminJinjia2(options))
      .pipe(gulp.dest(destpath))
      .pipe($.notify('htmltask success'))
      .pipe(reload({stream:true}));
    });
  }
};

var fonttask = function(taskname, srcpath, destpath){
  return gulp.task(taskname, function(){
    return gulp.src(srcpath)
    .pipe($.cached())
    .pipe($.plumber(errorHandler))
    .pipe(gulp.dest(destpath))
    .pipe(reload({stream:true}));
  })
};

var all_task = {
  dev: function(pretask, presrc, predest){
    htmltask.dev(pretask + '-html_view:dev', presrc + 'view/*', predest + 'view');
    htmltask.dev(pretask + '-html_index:dev', presrc + '/*.html', predest);
    fonttask(pretask + '-font:dev', presrc + 'css/fonts/font/*', predest + 'css/fonts/font');
    fonttask(pretask + '-iconfont:dev', presrc + 'css/fonts/iconfont/*', predest + 'css/fonts/iconfont');
    imgtask.dev(pretask + '-img:dev', presrc + 'img/*', predest + 'img/');
    imgtask.dev(pretask + '-ico:dev', presrc + '*.ico', predest);
    csstask.dev(pretask + '-css:dev', presrc + 'sass/*.scss', predest + 'css', predest, '../img/icon/spriter.png');
    csstask.dev(pretask + '-css_com:dev', presrc + 'sass/common/*.scss', predest + 'css/common', predest, '../../img/icon/spriter.png');
    jstask.dev(pretask + '-js:dev', presrc + 'js/*', predest + 'js');
    jstask.dev(pretask + '-js_com:dev', presrc + 'js/common/*', predest + 'js/common');
  },
  build: function(pretask, presrc, predest){
    htmltask.build(pretask + '-html_view:build', presrc + 'view/*', predest + 'view');
    htmltask.build(pretask + '-html_index:build', presrc + '*.html', predest);
    fonttask(pretask + '-font:build', presrc + 'css/fonts/font/*', predest + 'css/fonts/font');
    fonttask(pretask + '-iconfont:build', presrc + 'css/fonts/iconfont/*', predest + 'css/fonts/iconfont');
    imgtask.build(pretask + '-img:build', presrc + 'img/*', predest + '/img');
    imgtask.build(pretask + '-icon:build', presrc + 'img/icon/*', predest + '/img/icon');
    imgtask.build(pretask + '-ico:build', presrc + '*.ico', predest);
  }
}


var imgtask = {
  dev: function(taskname, srcpath, destpath){
    return gulp.task(taskname, function(){
      return gulp.src(srcpath)
      .pipe($.cached())
      .pipe($.plumber(errorHandler))
      .pipe($.imagemin())
      .pipe(gulp.dest(destpath))
      .pipe($.notify('imgtask success'))
      .pipe(reload({stream:true}));
    });
  },
  build: function(taskname, srcpath, destpath){
    return gulp.task(taskname, function(){
      return gulp.src(srcpath)
      .pipe(gulp.dest(destpath))
      .pipe($.notify('imgtask success'));
    });
  }
};

var csstask = {
  dev: function(taskname, srcpath, destpath, spritePre, spriteDest){
    return gulp.task(taskname, function(){
      return gulp.src(srcpath)
      .pipe($.cached())
      .pipe($.plumber(errorHandler))
      .pipe($.sass({
        outputStyle: 'compact'
      }))
      .pipe($.postcss(processors))
      .pipe($.csslint())
      .pipe($.csslint.formatter())
      .pipe($.cssSpriter({
        'spriteSheet': spritePre + 'img/icon/spriter.png',
        'pathToSpriteSheetFromCSS': spriteDest
      }))
      .pipe(gulp.dest(destpath))
      .pipe($.notify('csstask success'))
      .pipe(reload({stream:true}));
    });
  },
  build: function(taskname, srcpath, destpath){
    return gulp.task(taskname, function(){
      return gulp.src(srcpath)
      .pipe($.cssnano({
              discardComments: {
                  removeAll: true
              }
          }))
      .pipe(gulp.dest(destpath))
      .pipe($.notify('csstask success'))
      .pipe(reload({stream:true}));
    });
  }
};

var jstask = {
  dev: function(taskname, srcpath, destpath){
    return gulp.task(taskname, function(){
      return gulp.src(srcpath)
      .pipe($.cached())
      .pipe($.plumber(errorHandler))
      .pipe($.jshint())
      .pipe($.jshint.reporter('jshint-stylish'))
      .pipe(gulp.dest(destpath))
      .pipe($.notify('jstask success'))
      .pipe(reload({stream:true}));
    });
  },
  build: function(taskname, srcpath, destpath){
    return gulp.task(taskname, function(){
      return gulp.src(srcpath)
      .pipe($.uglify())
      .pipe(gulp.dest(destpath))
      .pipe($.notify('jstask success'));
    });
  }
};

var server = function(pretask, server, predir){
  if (pretask === 'm') {
    all_task.dev(pretask, msrc, mtmp);
  }
  if (pretask === 'pc') {
    all_task.dev(pretask, pcsrc, pctmp);
  }
  return gulp.task('dev', 
      [
         pretask + '-img:dev',
         pretask + '-html_view:dev',
         pretask + '-html_index:dev',
         pretask + '-css:dev',
         pretask + '-css_com:dev',
         pretask + '-js:dev',
         pretask + '-js_com:dev',
         pretask + '-font:dev',
         pretask + '-iconfont:dev',
         pretask + '-ico:dev'
      ], function(){
      browserSync.init({
        server: server,
        port: 3000,
        notify: true
      });
      gulp.watch(predir + 'img/*', [pretask + '-img:dev']);
      gulp.watch(predir + '*.ico', [pretask + '-ico:dev']);
      gulp.watch(predir + 'sass/*', [pretask + '-css:dev']);
      gulp.watch(predir + 'sass/common/*', [pretask + '-css_com:dev']);
      gulp.watch(predir + 'js/*', [pretask + '-js:dev']);
      gulp.watch(predir + 'js/common/*', [pretask + '-js_com:dev']);
      gulp.watch(predir + 'view/*', [pretask + '-html_view:dev']);
      gulp.watch(predir + '*.html', [pretask + '-html_index:dev']);
      gulp.watch(predir + 'css/fonts/font/*', [pretask + '-font:dev']);
      gulp.watch(predir + 'css/fonts/iconfont/*', [pretask + '-iconfont:dev']);

  });
}

var build = function(pretask){
  if (pretask === 'm') {
    all_task.build(pretask, mtmp, mdist)
  }
  if (pretask === 'pc') {
    all_task.build(pretask, pctmp, pcdist)
  }
  gulp.task('build', $.sequence(pretask + '-clean',
       [
        pretask +'-img:build',
        pretask + '-icon:build',
        pretask +'-html_index:build',
        pretask +'-html_view:build', 
        pretask + '-font:build', 
        pretask + '-iconfont:build',
        pretask + '-ico:build'
       ]));
}

// run mobile server
// server('m', mdev_server, msrc);
// gulp dev

// run desktop server
server('pc', pcdev_server, pcsrc);
// gulp dev


// build mobile
// build('m');

// build pc
build('pc');

// gulp build
// gulp tmp-clean

