import { InputOptions, OutputOptions } from 'rollup';
import { Transform } from 'stream';

declare function rollup(inputOptions?: InputOptions, outputOptions?: OutputOptions): Transform;

export = rollup;
