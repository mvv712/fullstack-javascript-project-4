import axios from 'axios';
import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import path from 'path';
import beautify from 'js-beautify';
import { urlToFileName, urlToFolderName } from './utils.js';

export default (content, url, output) => {
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

  return fsp.mkdir(path.join(output, folder), { recursive: true })
    .then(async () => {
      /* eslint-disable-next-line */
      for (const elem of elems) {
        const { tag, value, href } = elem;
        const filename = urlToFileName(href);

        /* eslint-disable-next-line */
        await axios.get(href, { responseType: 'arraybuffer' })
          .then(({ data }) => fsp.writeFile(path.join(output, folder, filename), data))
          .then(() => {
            $(`[${tags[tag]}=${value}]`).attr(tags[tag], `${folder}/${filename}`);
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
