// News-image entry for make.fun news-image-20261118 (Node 22, standard library only).
// The front-page image lives beside this file; the program copies it to the output
// directory (MAKEFUN_OUTPUT_DIR, or /output when unset):
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = join(dirname(fileURLToPath(import.meta.url)), 'entry.png');
const dst = join(outDir, 'entry.png');

// Fail fast on a corrupt source: the file must already be a whole PNG.
const srcBytes = readFileSync(src);
if (srcBytes.length > 1048576) throw new Error(`entry.png is ${srcBytes.length} bytes, over the 1 MiB cap`);
if (srcBytes[0] !== 0x89 || srcBytes[1] !== 0x50 || srcBytes[2] !== 0x4e || srcBytes[3] !== 0x47) throw new Error('entry.png is not a PNG');
mkdirSync(outDir, { recursive: true });
copyFileSync(src, dst);

// Verify the output the gate will see matches the source byte for byte.
const bytes = readFileSync(dst);
if (bytes.length !== srcBytes.length || !bytes.equals(srcBytes)) throw new Error('copied entry.png differs from the source');
console.log(`wrote ${dst} (${bytes.length} bytes)`);
