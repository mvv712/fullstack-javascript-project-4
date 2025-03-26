import fsp from 'fs/promises';
import path from 'path';
import nock from 'nock';
import os from 'os';
import {
  afterEach, beforeEach, expect, test,
} from '@jest/globals';
import loadPage from '../src/page-loader.js';
import { getFixturePath, urlToFileName } from '../src/utils.js';

nock.disableNetConnect();
const url = {
  host: 'https://ru.hexlet.io',
  page: '/courses',
  full: 'https://ru.hexlet.io/courses',
  img: '/assets/professions/nodejs.png',
};
const testUrl = getFixturePath('input/page-loader-test.html');
let testUrlContent;
let testOutput;
let testUrlPath;

beforeEach(async () => {
  nock(url.host)
    .get(url.page)
    .reply(200, testUrlContent)
    .get(url.img)
    .replyWithFile(200, getFixturePath('input/ru-hexlet-io-assets-professions-nodejs.png'))
    .get('/assets/application.css')
    .replyWithFile(200, getFixturePath('input/application.css'))
    .get('/courses')
    .replyWithFile(200, getFixturePath('input/ru-hexlet-io-courses.html'))
    .get('/packs/js/runtime.js')
    .replyWithFile(200, getFixturePath('input/ru-hexlet-io-packs-js-runtime.js'))
    .get('/assets/application2.css')
    .replyWithFile(200, getFixturePath('input/application2.css'));

  testUrlContent = await fsp.readFile(testUrl, 'utf-8');
  testOutput = await fsp.mkdtemp(path.join(os.tmpdir(), 'page-loader-'));
  testUrlPath = path.join(testOutput, urlToFileName(url.full));
});

test('return path test', async () => {
  const received = await loadPage(url.full, testOutput);
  expect(received).toBe(testUrlPath);
});

test('correct result', async () => {
  const receivedPath = await loadPage(url.full, testOutput);
  const receivedContent = await fsp.readFile(receivedPath, 'utf-8');
  const expectedContent = await fsp.readFile(getFixturePath('result.html'), 'utf-8');
  expect(receivedContent).toStrictEqual(expectedContent);
});

test('load imgs', async () => {
  await loadPage(url.full, testOutput);
  const img = (await fsp.readFile(path.join(testOutput, 'ru-hexlet-io-courses_files', 'ru-hexlet-io-assets-professions-nodejs.png'), 'utf-8')).toString();
  const testImg = (await fsp.readFile(getFixturePath('input/ru-hexlet-io-assets-professions-nodejs.png'), 'utf-8')).toString();

  expect(img).toStrictEqual(testImg);
});

afterEach(async () => {
  nock.cleanAll();
  await fsp.rmdir(testOutput, { recursive: true });
});
