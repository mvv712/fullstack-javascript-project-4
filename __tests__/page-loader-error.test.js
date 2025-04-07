import fsp from 'fs/promises';
import path from 'path';
import nock from 'nock';
import os from 'os';
import {
  afterEach, beforeEach, expect, test, describe,
} from '@jest/globals';
import loadPage from '../src/page-loader.js';

const getFixturePath = (filename = '') => path.join('__fixtures__', filename);

nock.disableNetConnect();
const data = {
  host: 'https://ru.hexlet.io',
  page: '/courses',
  fullUrl: 'https://ru.hexlet.io/courses',
};
const testUrl = getFixturePath('ru-hexlet-io-courses.html');
let testUrlContent;
let testOutput;

describe('page-loader error tests', () => {
  beforeEach(async () => {
    testUrlContent = await fsp.readFile(testUrl, 'utf-8');
    testOutput = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  });

  test('wrong url', async () => {
    await expect(loadPage('notUrl', testOutput)).rejects.toThrow('Invalid URL');
  });

  test('network error', async () => {
    nock(data.host)
      .get(data.page)
      .reply(404, 'Page not found');

    await expect(loadPage(data.fullUrl, testOutput)).rejects.toThrow('Request failed with status code 404');
  });

  test('permissions error in folder', async () => {
    nock(data.host)
      .get(data.page)
      .reply(200, testUrlContent);

    const invalidPath = path.join(os.tmpdir(), 'invalid-directory');
    await expect(loadPage(data.fullUrl, invalidPath)).rejects.toThrow(`Not enough permissions in this folder ${invalidPath}`);
  });

  afterEach(async () => {
    nock.cleanAll();
    await fsp.rmdir(testOutput, { recursive: true });
  });
});
