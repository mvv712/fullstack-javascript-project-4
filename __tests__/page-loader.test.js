import fsp from 'fs/promises';
import path from 'path';
import nock from 'nock';
import os from 'os';
import loadPage from '../src/page-loader.js';
import { getFixturePath, urlToFileName } from '../src/utils.js';

nock.disableNetConnect();
const url = {
  site: 'https://ru.hexlet.io',
  page: '/courses',
};
const testUrl = getFixturePath('page-loader-test.html');
const testUrlContent = await fsp.readFile(testUrl, 'utf-8');
let testOutput; let
  testUrlPath;

describe('page-loader', () => {
  beforeEach(async () => {
    nock(url.site)
      .get(url.page)
      .reply(200, testUrlContent);

    testOutput = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
    testUrlPath = path.join(testOutput, urlToFileName(`${url.site}${url.page}`));
  });

  test('return path test', async () => {
    const result = await loadPage(`${url.site}${url.page}`, testOutput);
    expect(result).toBe(testUrlPath);
  });

  test('correct result', async () => {
    await loadPage(`${url.site}${url.page}`, testOutput);
    const testFileContent = await fsp.readFile(testUrlPath, 'utf-8');

    expect(testUrlContent).toStrictEqual(testFileContent);
  });
});
