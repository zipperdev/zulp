import gulp from "gulp";
import gulpPug from "gulp-pug";
import gulpWebserver from "gulp-webserver";
import gulpImage from "gulp-image";
import gulpAtx from "gulp-autoprefixer";
import gulpMinify from "gulp-csso";
import del from "del";

const gulpSass = require("gulp-sass")(require("sass"));
gulpSass.compiler = require("node-sass");

const routes = {
    pug: {
        src: "src/*.pug",
        watch: "src/**/*.pug",
        dest: "build"
    },
    img: {
        src: "src/img/*",
        dest: "build/img"
    },
    scss: {
        src: "src/scss/styles.scss",
        watch: "src/scss/**/*.scss",
        dest: "build/css"
    }
};

const clean = () => del(["build"]);

const pug = () => gulp.src(routes.pug.src)
    .pipe(gulpPug())
    .pipe(gulp.dest(routes.pug.dest));

const img = () => gulp.src(routes.img.src)
    .pipe(gulpImage())
    .pipe(gulp.dest(routes.img.dest));

const styles = () => gulp.src(routes.scss.src)
    .pipe(gulpSass().on("error", gulpSass.logError))
    .pipe(gulpAtx())
    .pipe(gulpMinify())
    .pipe(gulp.dest(routes.scss.dest));

const webserver = () => gulp.src("build")
    .pipe(gulpWebserver({ livereload: true, open: true }));

const watch = () => {
    gulp.watch(routes.pug.watch, pug);
    gulp.watch(routes.scss.watch, styles);
};

const prepare = gulp.series([clean, img]);
const assets = gulp.series([pug, styles]);
const deveolpment = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, deveolpment]);