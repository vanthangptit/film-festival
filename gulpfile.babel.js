import fs from 'fs';
import del from 'del';
import gulp from 'gulp';
import sass from 'gulp-sass';
import rename from 'gulp-rename';
import concat from 'gulp-concat';
import cleanCss from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import handlebars from 'gulp-compile-handlebars';
import layouts from 'handlebars-layouts';
import minimist from 'minimist';
import browserSync from 'browser-sync';
import handlebarAssets from './handlebar-helpers/index';
import { registerHandlebarsRender } from './handlebar-helpers/utils/compile';
import handlebarsCache from './handlebar-helpers/utils/cache';
import plumber from 'gulp-plumber';

const { helpers, decorators } = handlebarAssets;

const getRunningEnv = () => {
  const args = minimist(process.argv.slice(2)); //get all the arguments from the command line
  const { env = 'development' } = args;

  return env;
};

const getConfigs = () => {
  const env = getRunningEnv();

  const stylesConfPath = `./conf/styles-conf/${env}/`;
  const templatesConfPath = `./conf/templates-conf/${env}`;
  const envConf = require('./conf/development.json');

  return {
    stylesConfPath,
    templatesConfPath,
    ...envConf,
  };
};

// Please keep this top most
const configs = getConfigs();
const { buildFolders, outputFolders, stylesConfPath, templatesConfPath, vendors, base, pagesBasePath, locales, dataPath } = configs;
const { contentsPaths, stylesPaths, scriptsPaths, assetsPaths, htmlPaths, partialsPaths,
  layoutsPath, pagesPath } = buildFolders;
const { tmpPath, distPath, sitecorePath } = outputFolders;

const registerDecorators = (hbEnv, registeringDecorators) => {
  if (!hbEnv || !registeringDecorators) {
    return;
  }

  for (const [ key, value ] of Object.entries(registeringDecorators)) {
    hbEnv.registerDecorator(key, value);
  }
};

const registerHandlebarsLayouts = hbEnv => hbEnv.registerHelper(layouts(hbEnv));

export const html = () => {
  invalidateFileCache();
  const hbEnv = handlebars.Handlebars;
  registerDecorators(hbEnv, decorators);
  registerHandlebarsLayouts(hbEnv);
  registerHandlebarsRender(handlebars.Handlebars);

  const renderingVariables = require(`${templatesConfPath}/config.json`);
  const { gtm } = require('./conf/development.json');
  const data = JSON.parse(fs.readFileSync(`${dataPath}/landing.json`)).contents;

  renderingVariables.hasVendorScripts = !!vendors.scripts;
  renderingVariables.hasVendorStyles = !!vendors.styles;

  const options = {
    ignorePartials: true,
    batch: [ ...partialsPaths, layoutsPath ],
    helpers,
  };

  return gulp.src(pagesPath, { base: pagesBasePath, nodir: true })
    .pipe(handlebars({ ...renderingVariables, data, gtm }, options))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(tmpPath));
};

export const styles = () => {
  return gulp.src(stylesPaths)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: [ '.', stylesConfPath ]
    }).on('error', sass.logError))
    .pipe(cleanCss())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${tmpPath}/styles`));
};

export const scriptsVendor = () => {
  return gulp.src(vendors.scripts)
    .pipe(concat('vendors.min.js'))
    .pipe(gulp.dest(`${tmpPath}/scripts`));
};

export const scripts = () => {
  return gulp.src(scriptsPaths, { sourcemaps: true })
    .pipe(concat('app.js'))
    .pipe(gulp.dest(`${tmpPath}/scripts`, { sourcemaps: true }));
};

export const handlebarsRuntime = () => {
  return gulp.src([
    'node_modules/handlebars/dist/**/*',
  ])
    .pipe(plumber())
    .pipe(gulp.dest(`${tmpPath}scripts/libs/handlebars`));
};

export const assets = () => {
  return gulp.src(assetsPaths)
    .pipe(gulp.dest(`${tmpPath}assets`));
};

export const reload = (done) => {
  browserSync.reload();
  done();
};

export const hosting = () => {
  browserSync({
    notify: false,
    port: 8081,
    server: {
      baseDir: [ tmpPath ],
      index: 'landing.html'
    }
  });
};

export const clean = () => del([ `${tmpPath}`, `${distPath}` ]);

const watch = () => {
  gulp.watch(stylesPaths, { usePolling: true }, gulp.series(styles, copyToDistPath, reload));
  gulp.watch(scriptsPaths, { usePolling: true }, gulp.series(scripts, copyToDistPath, reload));
  gulp.watch(assetsPaths, { usePolling: true }, gulp.series(assets, copyToDistPath, reload));
  gulp.watch(htmlPaths, { usePolling: true }, gulp.series(html, copyToDistPath, reload));
  gulp.watch(contentsPaths, { usePolling: true }, gulp.series(html, copyToDistPath, reload));
};

const copyToDistPath = () => {
  return gulp.src(`${tmpPath}**/*`)
    .pipe(gulp.dest(distPath));
};

const copyToCode = () => {
  return gulp.src([
    `${tmpPath}**/*`,
    `!${tmpPath}**/*.map`,
    `!${tmpPath}assets/images`,
    `!${tmpPath}assets/images/**/*`,
    `!${tmpPath}styles/components`,
    `!${tmpPath}styles/components/**/*`,
  ])
    .pipe(gulp.dest(sitecorePath));
};

const invalidateFileCache = () => {
  handlebarsCache.invalidate();
  return gulp;
};

export const build = gulp.series(
  clean,
  gulp.parallel(
    html,
    styles,
    scripts,
    scriptsVendor,
    handlebarsRuntime,
    assets,
  ),
  copyToDistPath,
);

export const compile = gulp.series(
  clean,
  gulp.parallel(
    styles,
    scripts,
    scriptsVendor,
    handlebarsRuntime,
    assets,
  ),
  copyToCode
);

gulp.task('dev', gulp.series(build, gulp.parallel(hosting, watch)));
gulp.task('default', build);
