const test = require('ava');
const { src } = require('gulp');
const tap = require('gulp-tap');
const buble = require('@rollup/plugin-buble');
const rollup = require('../source');

test.before.cb(t => {
  src('./test/fixtures/basic.js')
    .pipe(rollup({
      plugins: [
        buble()
      ]
    }, {
      format: 'cjs',
      exports: 'auto'
    }))
    .pipe(tap(file => {
      t.context.data = file.contents.toString();
      t.end();
    }));
});

test('works on its own (cjs format)', t => {
  t.true(t.context.data.includes('module.exports'));
});

test('works together with a plugin (buble)', t => {
  t.false(t.context.data.includes('const'));
});
