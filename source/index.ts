import { Transform } from "node:stream";
import { Buffer } from "node:buffer";

import { rollup, type InputOptions, type OutputOptions } from "rollup";
import { type BufferFile } from "vinyl";

export = (
  inputOptions: InputOptions,
  outputOptions: OutputOptions
) => new Transform({
  objectMode: true,
  async transform(file: BufferFile, _encoding, done) {
    if (file.isNull()) {
      return done(null, file);
    }

    if (file.isStream()) {
      return done(new Error("Streams are not supported!"), file);
    }

    const build = await rollup({
      input: file.path,
      ...inputOptions
    });

    const { output: [ chunk ] } = await build.generate({
      sourcemap: Boolean(file.sourceMap) && "hidden",
      ...outputOptions
    });

    const modified = file.clone();
    modified.contents = Buffer.from(chunk.code);
    modified.sourceMap = chunk.map;

    return done(null, modified);
  }
});
