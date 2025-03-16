import { createRequire } from 'module';
import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import path from 'path';
import beautify from 'js-beautify';
import debug from './debug.js';
import { urlToFileName, urlToFolderName } from './utils.js';

const require = createRequire(import.meta.url);
require('axios-debug-log');
const axios = require('axios');

export default async (content, url, output) => {
  debug('load files');
  const $ = cheerio.load(content);
  const folder = urlToFolderName(url.href);
  const elems = [];

  const tags = {
    img: 'src',
    link: 'href',
    script: 'src',
  };

  Object.keys(tags).forEach((tag) => {
    const tagUrls = $(tag).map((i, elem) => $(elem).attr(tags[tag])).get();

    tagUrls.forEach((tagUrl) => {
      const tagFullUrl = new URL(tagUrl, url.href);
      if (url.host === tagFullUrl.host) {
        elems.push({
          tag,
          value: tagUrl,
          href: tagFullUrl.href,
        });
      }
    });
  });

  await fsp.mkdir(path.join(output, folder), { recursive: true });
  debug('create folder %s', path.join(output, folder));

  const promises = elems.map(async (elem) => {
    const { tag, value, href } = elem;
    const filename = urlToFileName(href);

    try {
      debug('get %s', href);
      const { data } = await axios.get(href, { responseType: 'arraybuffer' });
      await fsp.writeFile(path.join(output, folder, filename), data);
      $(`[${tags[tag]}=${value}]`).attr(tags[tag], `${folder}/${filename}`);
    } catch (error) {
      console.error('Error %s: %0', href, error);
    }
  });

  await Promise.all(promises);
  debug('all files loaded');

  return beautify.html($.html(), {
    extra_liners: [],
    indent_inner_html: true,
    indent_size: 2,
    preserve_newlines: false,
    wrap_attributes_indent_size: 1,
  });
};
