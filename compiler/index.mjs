import fs from 'fs';
import path from 'path';
import ast from 'abstract-syntax-tree';
import { clodeOriginalOnAst, getMapping } from './util.mjs';

const file = 'src/index.es6.js';
const fullPath = path.resolve(file);
const fileContent = fs.readFileSync(fullPath, 'utf8');

const sourceAst = ast.parse(fileContent, { loc: true });

// Add clone to originals property
clodeOriginalOnAst(sourceAst);

// Clone AST and reassign
const leftClone = Object.assign(
  {},
  sourceAst.body[0].body.body[0].argument.left
);

sourceAst.body[0].body.body[0].argument.left =
  sourceAst.body[0].body.body[0].argument.right;

sourceAst.body[0].body.body[0].argument.right = leftClone;

// Set Source File / Mapping
const { mappings, code, mozillaMap } = getMapping(sourceAst);
mozillaMap.setSourceContent(fileContent);

// Map from Mozilla
try {
  !fs.readdirSync('./build');
} catch {
  fs.mkdirSync('build');
}
fs.writeFileSync('./build/index.es5.js.map', mozillaMap.toString(), 'utf8');

// Add sourcemap location
code.push('\n');
code.push('//# sourceMappingURL=/static/index.es5.js.map');

fs.writeFileSync('./build/index.es5.js', code.join(''), 'utf8');
fs.writeFileSync('./build/index.es6.js', fileContent, 'utf8');
