const gulp = require("gulp");
const rollup = require("../dist");

gulp.task("default", () => gulp.src("fixtures/basic.js", {
  sourcemaps: true
})
  .pipe(rollup({}, {
    format: "iife",
    name: "test"
  }))
  .pipe(gulp.dest("results", {
    sourcemaps: "."
  })));
