import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import { urlToFileName } from './utils.js';
import loadFiles from './file-loader.js';
import debug from './debug.js';

const pageLoader = async (href, output = process.cwd()) => {
  let url;
  try {
    url = new URL(href);
  } catch (err) {
    throw new Error('wrong URL string');
  }

  const urlPath = path.join(output, urlToFileName(url.href));

  debug('check access folder %s', output);
  try {
    await fsp.access(output);
  } catch (err) {
    throw new Error(`Not enough permissions in this folder ${output}`);
  }

  debug('start load %s', url.href);
  return axios.get(url.href)
    .then(({ data }) => loadFiles(data, url, output))
    .then((html) => fsp.writeFile(urlPath, html))
    .then(() => urlPath);
};

export default pageLoader;
