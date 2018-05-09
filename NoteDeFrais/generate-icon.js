#!/usr/bin/env node
const argv = require('yargs')
  .usage('Usage: $0 [options] path/to/styles.css \nFor default template please provide --componentName and --fontFamily')
  .demand(1)
  .default('p', '.icon-')
  .describe('p', 'CSS selector prefix')
  .alias('p', 'prefix')
  .default('t', `${__dirname}/node_modules/react-native-vector-icons/template/iconSet.tpl`)
  .describe('t', 'Template in lodash format')
  .alias('t', 'template')
  .describe('o', 'Save output to file, defaults to STDOUT')
  .alias('o', 'output')
  .argv;

const _ = require('lodash');
const fs = require('fs');
const generateIconSetFromCss = require('./lib/generate-icon-set-from-css').default;

let template;
if (argv.template) {
  template = fs.readFileSync(argv.template, { encoding: 'utf8' });
}

const data = _.omit(argv, '_ $0 o output p prefix t template'.split(' '));


const content = generateIconSetFromCss(argv._, argv.prefix, template, data);
if (argv.output) {
  fs.writeFileSync(
    argv.output,
    content
  );
} else {
  console.log(content); // eslint-disable-line
}
