#!/usr/bin/env node

import { program } from 'commander';
import pageLoader from '../src/page-loader.js';

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0')
  .option('-o, --output <path>', 'output dir', process.cwd())
  .arguments('<url>')
  .action((url) => {
    const { output } = program.opts();
    pageLoader(url, output)
      .then((path) => console.log(path))
      .catch((err) => {
        console.error(`Page-loader error: ${err.message}`);
        process.exit(1);
      });
  })
  .parse();
