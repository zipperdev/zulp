import babelify from "babelify";
import gulp from "gulp";
import gulpAtx from "gulp-autoprefixer";
import gulpBro from "gulp-bro";
import gulpGhPages from "gulp-gh-pages";
import gulpImage from "gulp-image";
import gulpMinify from "gulp-csso";
import gulpPug from "gulp-pug";
import gulpWebserver from "gulp-webserver";
import del from "del";

const gulpSass = require("gulp-sass")(require("sass"));
gulpSass.compiler = require("node-sass");

const routes = {
    img: {
        src: "src/img/*", 
        dest: "build/img"
    }, 
    pug: {
        src: "src/*.pug", 
        watch: "src/**/*.pug", 
        dest: "build"
    }, 
    scss: {
        src: "src/scss/styles.scss", 
        watch: "src/scss/**/*.scss", 
        dest: "build/css"
    },  
    js: {
        src: "src/js/main.js", 
        watch: "src/js/**/*.js", 
        dest: "build/js"
    }
};

const clean = () => del(["build/", ".publish"]);

const img = () => gulp.src(routes.img.src)
    .pipe(gulpImage())
    .pipe(gulp.dest(routes.img.dest));

const pug = () => gulp.src(routes.pug.src)
    .pipe(gulpPug())
    .pipe(gulp.dest(routes.pug.dest));

const styles = () => gulp.src(routes.scss.src)
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(gulpAtx())
    .pipe(gulpMinify())
    .pipe(gulp.dest(routes.scss.dest));

const js = () => gulp.src(routes.js.src)
    .pipe(gulpBro({
        transform: [
            babelify.configure({ presets: ["@babel/preset-env"] }), 
            ["uglifyify", { global: true }]
        ]
    }))
    .pipe(gulp.dest(routes.js.dest));

const webserver = () => gulp.src("build")
    .pipe(gulpWebserver({ livereload: true, open: true }));

const ghDeploy = () => gulp.src("build/**/*")
    .pipe(gulpGhPages());

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.scss.watch, styles);
    gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([ clean, img ]);
const assets = gulp.series([ pug, styles, js ]);
const deveolpment = gulp.parallel([ webserver, watch ]);

export const build = gulp.series([ prepare, assets ]);
export const dev = gulp.series([ build, deveolpment ]);
export const deploy = gulp.series([ build, ghDeploy, clean ]);