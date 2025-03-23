#!/usr/bin/env node

import { program } from 'commander';
import pageLoader from '../src/page-loader.js';

program
  .name('page-loader')
  .description('Page loader utility')
  .version('1.0.0')
  .option('-o, --output <path>', 'output directory')
  .argument('<url>', 'URL to load')
  .action((url, options) => {
    const output = options.output || process.cwd();

    pageLoader(url, output)
      .then((path) => console.log(path))
      .catch((err) => {
        console.error(`Page-loader error: ${err.message}`);
        process.exit(1);
      });
  })
  .parse();
