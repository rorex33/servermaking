"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentDir = exports.start = exports.dirRequest = exports.pathRequest = void 0;
var pageChanging_js_1 = require("./pageChanging.js");
var index_js_1 = require("../index.js");
//Подключение селектора сортировки
var sortType = document.querySelector('.sortSelector');
sortType.addEventListener("click", selectorRequest);
//Переменные для подсчёта времени выполнения запросов
var start;
var currentDir;
//Общение с сервером
//
//
//Создание ссылки для запроса к серверу
function urlCreation(rootPathArray, sortTail, dirName, type) {
    // rootPathArray - наше текущее местонахождение
    // sortTail - тип сортировки (в ссылке он идёт самым последним аргументом, поэтому "tail")
    // dirName - передаём название папки, в которую мы хотим перейти
    // type = 1, если мы перешли по кнопкам, образующим путь в верхней части рабочей области.
    // type = 2, если мы нажали на одну из найденных директорий
    //Итоговый путь, который будет добавлен в ссылку
    var rootPath = "";
    if (type == 1) {
        //Если текущий путь пуст, то устанавливаем путь в корень системы
        if (rootPathArray.length == 0) {
            rootPath = "/home";
        }
        //Иначе находим, на какую часть текущего путя мы нажали, и образуем на его основе путь для ссылки
        else {
            var i = 0;
            while ("/" + rootPathArray[i] != dirName) {
                i++;
            }
            rootPath = "/" + rootPathArray.slice(0, i + 1).join("/");
        }
    }
    if (type == 2) {
        //Если текущий путь пуст, то устанавливаем путь в корень системы
        if (rootPathArray.length == 0) {
            rootPath = "/home";
        }
        //Иначе прибавляем к текущему путю директорию, на которую мы нажали, и образуем на его основе путь для ссылки
        else {
            rootPath = "/" + rootPathArray.join("/") + dirName;
        }
    }
    //Образование ссылки
    var headPart = "/dirsize?";
    var tailPart = "&sort=" + sortTail;
    var ROOT = "ROOT=" + rootPath;
    var url = headPart + ROOT + tailPart;
    return url;
}
//Функция-обработчик нажатия на путь
function pathRequest() {
    if (sortType == null) {
        console.log('Ошибка в функции "pathRequest": селектор выбора сортировки не был найден');
        return;
    }
    var url = "";
    //Начать отчёт выполнения запроса
    exports.start = start = Date.now();
    //Показать колесо загрузки и скрыть страницу
    var loader = new index_js_1.Loader(document.getElementById("content"), document.getElementById("loader"));
    loader.showLoader();
    //Формирование ссылки, Если вместо путя у нас приветственная надпись
    if (this.textContent[0] != "/") {
        url = urlCreation([], sortType.value, this.textContent, 1);
    }
    //Формирование ссылки в любом другом случае (когда путь уже есть)
    else {
        url = urlCreation(pageChanging_js_1.currentDirPath, sortType.value, this.textContent, 1);
    }
    //GET запрос по нашему url
    var xhr = new XMLHttpRequest();
    console.log(url);
    xhr.addEventListener("load", pageChanging_js_1.responseProcessing);
    xhr.open("GET", url);
    xhr.send();
}
exports.pathRequest = pathRequest;
//Функция-обработчик нажатия на папку
function dirRequest() {
    var url = "";
    //Начать отчёт выполнения запроса
    exports.start = start = Date.now();
    //Показать колесо загрузки и скрыть страницу
    var loader = new index_js_1.Loader(document.getElementById("content"), document.getElementById("loader"));
    loader.showLoader();
    //Получаем имя папки, на которую нажали, и формируем на её основе ссылку
    exports.currentDir = currentDir = this.getAttribute("name");
    url = urlCreation(pageChanging_js_1.currentDirPath, sortType.value, currentDir, 2);
    //GET запрос по нашему url
    var xhr = new XMLHttpRequest();
    console.log(url);
    xhr.addEventListener("load", pageChanging_js_1.responseProcessing);
    xhr.open("GET", url);
    xhr.send();
}
exports.dirRequest = dirRequest;
function selectorRequest() {
    var url = "";
    //Начать отчёт выполнения запроса
    exports.start = start = Date.now();
    //Показать колесо загрузки и скрыть страницу
    var loader = new index_js_1.Loader(document.getElementById("content"), document.getElementById("loader"));
    loader.showLoader();
    //Получаем имя папки, на которую нажали, и формируем на её основе ссылку
    exports.currentDir = currentDir = this.getAttribute("name");
    url = urlCreation(pageChanging_js_1.currentDirPath, sortType.value, "", 2);
    //GET запрос по нашему url
    var xhr = new XMLHttpRequest();
    console.log(url);
    xhr.addEventListener("load", pageChanging_js_1.responseProcessing);
    xhr.open("GET", url);
    xhr.send();
}
