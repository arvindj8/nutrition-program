
# "This is Single-page site for choosing a nutrition program"

## Technologies:
- HTML5
- SCSS
- JavaScript
- Webpack
- json-server

Данный проект является простым одностраничным сайтом для подбора рациона питания человека с разной дневной активностью.
В проекте реализовано переключение табов, добавлена отправка данный на фейковый сервер из модальных окон и форм. Реализован честный таймер акции, калькулятор подсчета калорий, и подгрузка из фейкового сервера карточек с меню. Также реализована работа слайдера. Проект выполнен на чистом JavaScript без дополнительных библиотек.


This project is a simple one-page site for selecting the diet of a person with different daily activities.
The project implemented tab switching, added sending data to a fake server from modal windows and forms. An honest stock timer, a calorie calculator, and loading of menu cards from a fake server have been implemented. The slider has also been implemented. The project is made in pure JavaScript without additional libraries.

## Install requirements
### `nmp i`

## Run json-server
### `json server db.json`

## Run GULP and run project
### `gulp`

## Requirements
```
{
  "name": "nutrition-program",
  "version": "1.0.0",
  "description": "This is a site for choosing a nutrition program",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "alexandr buklov",
  "license": "ISC",
  "devDependencies": {
    "json-server": "^0.17.3",
    "webpack": "^5.81.0",
    "webpack-cli": "^5.0.2"
  }
}
```
