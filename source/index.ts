import { Transform } from "node:stream";

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

    const clone: BufferFile = {
      ...file,
      contents: Buffer.from(chunk.code),
      ...Boolean(file.sourceMap) && Boolean(chunk.map) && {
        sourceMap: chunk.map
      }
    };

    return done(null, clone);
  }
});
