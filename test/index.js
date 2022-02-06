const test = require('ava');
const { src } = require('gulp');
const tap = require('gulp-tap');
const buble = require('@rollup/plugin-buble');
const rollup = require('../source');

test.before(t => new Promise(resolve => {
  src('./test/fixtures/basic.js')
    .pipe(rollup({
      plugins: [ buble() ]
    }, {
      format: 'cjs',
      exports: 'auto'
    }))
    .pipe(tap(({ contents }) => {
      t.context = contents.toString();
      resolve();
    }));
}));

test('works on its own (cjs format)', t => {
  t.true(t.context.includes('module.exports'));
});

test('works together with a plugin (buble)', t => {
  t.false(t.context.includes('const'));
});
