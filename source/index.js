const { Transform } = require('stream');
const applySourceMap = require('vinyl-sourcemaps-apply');
const PluginError = require('plugin-error');
const { rollup } = require('rollup');

const pluginName = '@rbnlffl/gulp-rollup';

module.exports = (
  inputOptions = {},
  outputOptions = {}
) => new Transform({
  objectMode: true,
  async transform(file, _encoding, done) {
    if (file.isNull()) {
      return done(null, file);
    }

    if (file.isStream()) {
      return this.emit('error', new PluginError(pluginName, 'Streams are not supported!'));
    }

    const rollupInputOptions = {
      input: file.path,
      ...inputOptions
    };

    const rollupOutputOptions = {
      sourcemap: !!file.sourceMap,
      ...outputOptions
    };

    try {
      const bundle = await rollup(rollupInputOptions);
      const { output } = await bundle.generate(rollupOutputOptions);
      const [ result ] = output;

      if (file.sourceMap && result.map) {
        applySourceMap(file, result.map);
      }

      file.contents = Buffer.from(result.code);

      return done(null, file);
    } catch (rollupError) {
      return this.emit('error', new PluginError(pluginName, rollupError));
    }
  }
});
