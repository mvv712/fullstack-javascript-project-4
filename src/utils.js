import path from 'path';

export default (url, type = 'file') => {
  const { dir, name, ext } = path.parse(url);

  /* get the part without the protocol and the last non-letter character */
  const host = `${dir}/${name}`.replace(/^\w+:\/\/(.*?)\/?$/, '$1');

  const curExt = type === 'folder' ? '_files' : (ext || '.html');
  return host.replace(/[^\w]/g, '-').concat(curExt);
};
