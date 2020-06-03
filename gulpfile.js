"use strict";

const gulp = require("gulp");
const less = require("gulp-less");
const fileinclude = require('gulp-file-include');
const webpack = require("webpack-stream");
const browsersync = require("browser-sync");

const dist = "./dist/";

gulp.task("copy-html", () => {
    return gulp.src(["./src/html/*.html", "./src/html/_includes/*.html"])
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(dist))
        .pipe(browsersync.stream());
});

gulp.task("build-js", () => {
    return gulp.src("./src/js/main.js")
        .pipe(webpack({
            mode: 'development',
            output: {
                filename: 'script.js'
            },
            watch: false,
            devtool: "source-map",
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', {
                                    debug: true,
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(dist))
        .on("end", browsersync.reload);
});

gulp.task("build-less", () => {
    return gulp.src("./src/less/main.less")
        .pipe(less())
        .pipe(gulp.dest(dist + "assets/css"))
        .pipe(browsersync.stream());
});

gulp.task("copy-assets", () => {
    return gulp.src("./src/assets/**/*.*")
        .pipe(gulp.dest(dist + "assets"))
        .on("end", browsersync.reload);
});

gulp.task("watch", () => {
    browsersync.init({
        server: dist,
        port: 4000,
        notify: true
    });

    gulp.watch("./src/less/*.less", gulp.parallel("build-less"));
    gulp.watch(["./src/html/*.html", "./src/html/_includes/*.html"], gulp.parallel("copy-html"));
    gulp.watch("./src/assets/**/*.*", gulp.parallel("copy-assets"));
    gulp.watch("./src/js/**/*.js", gulp.parallel("build-js"));
});

gulp.task("build", gulp.series("copy-html", "build-less", "copy-assets", "build-js"));

gulp.task("build-prod-js", () => {
    return gulp.src("./src/js/main.js")
        .pipe(webpack({
            mode: 'production',
            output: {
                filename: 'script.js'
            },
            module: {
                rules: [
                    {
                        test: /\.m?js$/,
                        exclude: /(node_modules|bower_components)/,
                        use: {
                            loader: 'babel-loader',
                            options: {
                                presets: [['@babel/preset-env', {
                                    corejs: 3,
                                    useBuiltIns: "usage"
                                }]]
                            }
                        }
                    }
                ]
            }
        }))
        .pipe(gulp.dest(dist));
});

gulp.task("default", gulp.parallel("watch", "build"));