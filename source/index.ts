import { Buffer } from "node:buffer";
import { Transform } from "node:stream";

import { rollup, type InputOptions, type OutputOptions } from "rollup";
import type { BufferFile } from "vinyl";

export = (
  inputOptions: InputOptions,
  outputOptions: OutputOptions
) => new Transform({
  objectMode: true,
  async transform(file: BufferFile, _encoding, done) {
    if (file.isNull()) {
      done(null, file);
      return;
    }

    if (file.isStream()) {
      done(new Error("Streams are not supported!"), file);
      return;
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

    done(null, modified);
  }
});
