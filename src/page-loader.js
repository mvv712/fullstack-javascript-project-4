import axios from 'axios';
import fsp from 'fs/promises';
import path from 'path';
import urlToName from './utils.js';
import loadFiles from './file-loader.js';
import debug from './debug.js';

const pageLoader = async (href, output = process.cwd()) => {
  const url = new URL(href);

  const urlPath = path.join(output, urlToName(url.href));

  debug(`check access folder ${output}`);
  return fsp.access(output)
    .catch(() => {
      throw new Error(`Not enough permissions in this folder ${output}`);
    })
    .then(() => {
      debug(`start load ${url.href}`);
      return axios.get(url.href);
    })
    .then(({ data }) => loadFiles(data, url, output))
    .then((html) => fsp.writeFile(urlPath, html))
    .then(() => urlPath);
};

export default pageLoader;
