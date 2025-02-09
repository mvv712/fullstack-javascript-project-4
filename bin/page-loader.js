#!/usr/bin/env node

import { program } from 'commander';

program
	.name('page-loader')
	.description('Page loader utility')
	.version('1.0.0')
	.option('-o, --output <path>')
	.arguments('<url>')
	.action((url) => {

	})
	.parse();