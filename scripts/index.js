"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
var requestToServer_1 = require("./requestToServer");
var Loader = /** @class */ (function () {
    function Loader(contentID, loaderID) {
        this.contentFromPage = contentID;
        this.loaderFromPage = loaderID;
    }
    Loader.prototype.showLoader = function () {
        if (this.contentFromPage != null && this.loaderFromPage != null) {
            this.contentFromPage.style.visibility = "hidden";
            this.loaderFromPage.style.visibility = "visible";
        }
        else {
            console.log('Ошибка при вызове метода "showLoader" объекта класса "Loader"');
        }
    };
    Loader.prototype.hideLoader = function () {
        if (this.contentFromPage != null && this.loaderFromPage != null) {
            this.contentFromPage.style.visibility = "visible";
            this.loaderFromPage.style.visibility = "hidden";
        }
        else {
            console.log('Ошибка при вызове метода "hideLoader" объекта класса "Loader"');
        }
    };
    return Loader;
}());
exports.Loader = Loader;
window.addEventListener("DOMContentLoaded", start);
function start() {
    var loader = new Loader(document.getElementById("content"), document.getElementById("loader"));
    loader.hideLoader();
    //Подключение начальной кнопки перехода в корневую директорию
    var enterButton = document.querySelector('.enterButton');
    //Обработка нажатия на начальную кнопку
    if (enterButton != null) {
        enterButton.addEventListener("click", requestToServer_1.pathRequest);
    }
    else {
        console.log('Не найдена кнопка входа ("enterButton")');
    }
}
