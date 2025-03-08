import axios from 'axios';
import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import path from 'path';
import beautify from 'js-beautify';
import { urlToFileName, urlToFolderName } from './utils.js';

const downloadImage = (url, directory) => {
  const filename = urlToFileName(url.href);
  const filepath = path.join(directory, filename);

  return axios.get(url, { responseType: 'arraybuffer' })
    .then(({ data }) => fsp.writeFile(filepath, data));
};

export default (data, url, output) => {
  const folder = urlToFolderName(url.href);

  return fsp.mkdir(path.join(output, folder), { recursive: true })
    .then(async () => {
      const $ = cheerio.load(data);

      const imgElems = $('img');
      const imgUrls = imgElems.map((i, img) => $(img).attr('src')).get();

      /* eslint-disable-next-line */
      for (const imgUrl of imgUrls) {
        const imgFullUrl = new URL(imgUrl, url.href);
        await downloadImage(imgFullUrl, path.join(output, folder))
         .then(() => {
          const image = urlToFileName(imgFullUrl.href);
          $(`[src=${imgUrl}]`).attr('src', `${folder}/${image}`);
         });
      }

      return beautify.html($.html(), {
        extra_liners: [],
        indent_inner_html: true,
        indent_size: 2,
        preserve_newlines: false,
        wrap_attributes_indent_size: 1,
      });
    });
};
