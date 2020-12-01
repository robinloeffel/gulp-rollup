# @rbnlffl/gulp-rollup

[![latest version on npm](https://img.shields.io/npm/v/@rbnlffl/gulp-rollup)](https://www.npmjs.com/package/@rbnlffl/gulp-rollup)
[![npm downloads a month](https://img.shields.io/npm/dm/@rbnlffl/gulp-rollup)](https://www.npmjs.com/package/@rbnlffl/gulp-rollup)
[![required node version](https://img.shields.io/node/v/@rbnlffl/gulp-rollup)](https://github.com/nodejs/Release)
[![dependency status](https://img.shields.io/david/robinloeffel/gulp-rollup)](https://david-dm.org/robinloeffel/gulp-rollup)
[![gulp peer dep](https://img.shields.io/npm/dependency-version/@rbnlffl/gulp-rollup/peer/gulp?label=gulp%20peer%20dep)](https://github.com/gulpjs/gulp)
[![rollup dep](https://img.shields.io/npm/dependency-version/@rbnlffl/gulp-rollup/rollup?label=rollup%20dep)](https://github.com/rollup/rollup)
[![package license](https://img.shields.io/npm/l/@rbnlffl/gulp-rollup)](license)

> An intuitive [`gulp`](https://github.com/gulpjs/gulp) wrapper around [`rollup`](https://github.com/rollup/rollup). 🌯

Nicely integrates the most recent version of [`rollup`](https://github.com/rollup/rollup) into a [`gulp`](https://github.com/gulpjs/gulp) plugin.

## Setup

```sh
yarn add @rbnlffl/gulp-rollup --dev
```

```js
const { src, dest } = require('gulp');
const rollup = require('@rbnlffl/gulp-rollup');

module.exports.js = () => src('source/js/index.js')
  .pipe(rollup())
  .pipe(dest('public/js'));
```

## Config

The plugin takes two options objects and passes them mostly unmodified down to `rollup`. The first object is of type [`InputOptions`](https://rollupjs.org/guide/en/#inputoptions-object) and the second one of type [`OutputOptions`](https://rollupjs.org/guide/en/#outputoptions-object). Below you'll find the most common options.

### `inputOptions`

These options handle how `rollup` should treat the input it's getting. Keep in mind that directly manipulating the [`input`](https://rollupjs.org/guide/en/#input) property is strongly discouraged, as this gets handled by the plugin itself. If you really want to or know what you're doing, you can still play around with it. I'm not the police or anything.

#### `plugins`

Type: `Plugin[]`<br>
Default: `undefined`<br>

An array of `rollup` plugins you want to use. [`@rbnlffl/rollup-plugin-eslint`](https://github.com/robinloeffel/rollup-plugin-eslint), for example.

#### `external`

Type: `string`, `string[]`, `RegExp` or `RegExp[]`<br>
Default: `undefined`<br>

Instruct `rollup` what packages it should treat as external dependencies. An example could be [`core-js`](https://github.com/zloirock/core-js) polyfills injected via [`@rollup/plugin-babel`](https://github.com/rollup/plugins/tree/master/packages/babel).

### `outputOptions`

Tells `rollup` what the chunk it emits should look like. As with the `inputOptions` before, directly playing around with the [`dir`](https://rollupjs.org/guide/en/#outputdir), [`file`](https://rollupjs.org/guide/en/#outputfile) and [`sourcemap`](https://rollupjs.org/guide/en/#outputsourcemap) properties is not recommended and can lead to unexpected side-effects.

#### `format`

Type: `string`<br>
Default: `'es'`<br>

Controls in what format the code should be. Valid values are `'es'`, `'amd'`, `'cjs'`, `'iife'`, `'umd'` and `'system'`.

#### `name`

Type: `string`<br>
Default: `undefined`<br>

Used to define the name of your emitted `iife` or `umd` bundle.

## An advanced example

The example below shows how you can integrate the plugin into the pipeline, how to conditionally generate source maps and how you could conditionally filter out `rollup` plugins.

```js
const { src, dest } = require('gulp');
const plumber = require('gulp-plumber');
const rollup = require('@rbnlffl/gulp-rollup');
const eslint = require('@rbnlffl/rollup-plugin-eslint');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const buble = require('@rollup/plugin-buble');
const { terser } = require('rollup-plugin-terser');
const rename = require('gulp-rename');

const production = process.argv.includes('--prod');

module.exports.js = () => src('source/js/index.js', {
    sourcemaps: !production
  })
  .pipe(plumber())
  .pipe(rollup({
    plugins: [
      eslint(),
      nodeResolve(),
      commonjs(),
      production && buble(),
      production && terser()
    ].filter(plugin => plugin)
  }, {
    format: 'iife'
  }))
  .pipe(rename('bundle.js'))
  .pipe(dest('public/js', {
    sourcemaps: '.'
  }));
```

## Why a new plugin?

Mainly because I don't like the API of [`gulp-rollup`](https://github.com/mcasimir/gulp-rollup). Absolutely nothing wrong with it, just personal preference. Also because it's a nice excercise on understanding how both [`gulp`](https://github.com/gulpjs/gulp) and [`rollup`](https://github.com/rollup/rollup) work under the hood.

## License

MIT
