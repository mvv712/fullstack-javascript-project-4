import axios from 'axios';
import * as cheerio from 'cheerio';
import fsp from 'fs/promises';
import path from 'path';
import beautify from 'js-beautify';
import { urlToFileName, urlToFolderName } from './utils.js';

export default async (content, url, output) => {
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

  const promises = elems.map(async (elem) => {
    const { tag, value, href } = elem;
    const filename = urlToFileName(href);

    const { data } = await axios.get(href, { responseType: 'arraybuffer' });
    await fsp.writeFile(path.join(output, folder, filename), data);
    $(`[${tags[tag]}=${value}]`).attr(tags[tag], `${folder}/${filename}`);
  });

  await Promise.all(promises);

  return beautify.html($.html(), {
    extra_liners: [],
    indent_inner_html: true,
    indent_size: 2,
    preserve_newlines: false,
    wrap_attributes_indent_size: 1,
  });
};
