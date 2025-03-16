### Hexlet tests and linter status:
[![Actions Status](https://github.com/mvv712/fullstack-javascript-project-4/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/mvv712/fullstack-javascript-project-4/actions)
[![actions](https://github.com/mvv712/fullstack-javascript-project-4/actions/workflows/actions.yml/badge.svg)](https://github.com/mvv712/fullstack-javascript-project-4/actions/workflows/actions.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/1edc085078c57aac92f4/maintainability)](https://codeclimate.com/github/mvv712/fullstack-javascript-project-4/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/1edc085078c57aac92f4/test_coverage)](https://codeclimate.com/github/mvv712/fullstack-javascript-project-4/test_coverage)

# Проект "Загрузчик страниц"

## About
Program can download any website in html-format.
In addition, this program download all assets:
- images
- links (css of other types)
- scripts (only local)

## Installation
Clone repository
```bash
git clone https://github.com/mvv712/fullstack-javascript-project-4.git
```

## Using
```bash
node bin/page-loader.js --output folder url
make start --output folder url
```
folder - download directory ( default = process.cwd() )
url - website

For example:
./screenshots/step1.jpg
./screenshots/step3.jpg

## Debug
Also you can use debug for page-loader
```bash
NODE_DEBUG=nock:* DEBUG=page-loader,axios node bin/page-loader.js url
```

For example:
./screenshots/step4_1.jpg
./screenshots/step4_2.jpg

## Errors
Throwing errors for user on screenshot ./screenshots/step5.jpg