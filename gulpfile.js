const path = require("path");
const { src, dest, watch, series } = require("gulp");
const browserSync = require("browser-sync").create();
const sassCompiler = require("sass");
const gulpSass = require("gulp-sass")(sassCompiler);
const fileInclude = require("gulp-file-include");

const paths = {
  stylesEntry: "src/sass/*.scss",
  stylesWatch: "src/sass/**/*.scss",
  stylesDest: "src/public/assets/css",
  html: "src/**/*.html",
  htmlTemplates: "src/templates/*.html",
  htmlPartials: "src/partials/**/*.html",
};

function styles() {
  return src(paths.stylesEntry, { sourcemaps: true })
    .pipe(
      gulpSass({ outputStyle: "expanded" }).on("error", gulpSass.logError)
    )
    .pipe(dest(paths.stylesDest, { sourcemaps: "." }))
    .pipe(browserSync.stream());
}

/** src/templates/*.html → src/*.html（下層ページの共通パーシャル展開） */
function htmlIncludes() {
  return src(paths.htmlTemplates)
    .pipe(
      fileInclude({
        prefix: "@@",
        basepath: path.join(__dirname, "src"),
      })
    )
    .pipe(dest("src"));
}

function serve(done) {
  browserSync.init({
    server: {
      baseDir: "src",
    },
    open: false,
    notify: false,
    port: 8080,
  });
  done();
}

function watchFiles() {
  watch(paths.stylesWatch, styles);
  watch([paths.htmlTemplates, paths.htmlPartials], series(htmlIncludes, reload));
  watch(
    ["src/**/*.html", "!src/templates/**", "!src/partials/**"]
  ).on("change", browserSync.reload);
}

function reload(done) {
  browserSync.reload();
  done();
}

exports.styles = styles;
exports.htmlIncludes = htmlIncludes;
exports.build = series(styles, htmlIncludes);
exports.default = series(styles, htmlIncludes, serve, watchFiles);
