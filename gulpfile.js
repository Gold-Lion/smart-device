`use strict`;

const {src, dest, watch, series} = require(`gulp`);
const plumber = require(`gulp-plumber`);
const sourcemap = require(`gulp-sourcemaps`);
const sass = require(`gulp-sass`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const sync = require(`browser-sync`).create();
const csso = require(`gulp-csso`);
const rename = require(`gulp-rename`);
const imagemin = require(`gulp-imagemin`);
const webpImage = require(`gulp-webp`);
const svgstore = require(`gulp-svgstore`)
const posthtml = require(`gulp-posthtml`);
const include = require(`posthtml-include`);
const del = require(`del`);

const css = () => {
  return src(`source/sass/style.scss`)
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([ autoprefixer() ]))
    .pipe(csso())
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(dest(`build/css`))
    .pipe(sync.stream());
};

const server = () => {
  sync.init({
    server: `build/`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  watch(`source/sass/**/*.{scss,sass}`, series(css));
  watch(`source/img/icon-*.svg`, series(sprite, html, refresh));
  watch(`source/*.html`, series(html, refresh));
};

const refresh = (done) => {
  sync.reload();
  done();
};

const images = () => {
  return src(`source/img/**/*.{png,jpg,svg}`)
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo()
    ]))

    .pipe(dest(`source/img`));

};

const webp = () => {
  return src(`source/img/**/*.{png,jpg}`)
    .pipe(webpImage({quality: 90}))
    .pipe(dest(`source/img`));
};

const sprite = () => {
  return src(`source/img/{icon-*,htmlacademy*}.svg`)
    .pipe(svgstore({inlineSvg: true}))
    .pipe(rename(`sprite.svg`))
    .pipe(dest(`build/img`));
};

const html = () => {
  return src(`source/*.html`)
    .pipe(posthtml([
      include()
    ]))
    .pipe(dest(`build`));
};

const copy = () => {
  return src([
    `source/fonts/**/*.{woff,woff2}`,
    `source/img/**`,
    `source/js/**`,
    `source//*.ico`
    ], {
      base: `source`
    })
  .pipe(dest(`build`));
};

const clean = () => {
  return del(`build`);
};

exports.css = css;
exports.server = server;
exports.refresh = refresh;
exports.images = images;
exports.webp = webp;
exports.sprite = sprite;
exports.html = html;
exports.copy = copy;
exports.clean = clean;

exports.build = series(clean, copy, css, sprite, html);
exports.start = series(this.build, server);
