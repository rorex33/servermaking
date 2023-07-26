"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.currentDirPath = exports.responseProcessing = void 0;
var requestToServer_js_1 = require("./requestToServer.js");
var index_js_1 = require("./index.js");
//Путь к текущему местонахождению, разбитый по сепаратору "/" и сохранённый в массив
var currentDirPath = [];
exports.currentDirPath = currentDirPath;
//Формирование папок на странице
function dirPageForming(response) {
    //Взятие имени папки из ответа сервера
    var makeDirName = function (data, i) {
        if (data["dirs"][i] != undefined)
            return "/" + data["dirs"][i]["name"];
        else
            return "";
    };
    //Взятие размера папки папки из ответа сервера
    var makeDirSize = function (data, i) {
        if (data["dirs"][i] != undefined)
            return "[" + data["dirs"][i]["size"] + " mb]";
        else
            return "";
    };
    //Формируем контейнер, который будет родителем для других контейнеров
    //Эти контейнеры будут содержать имена файлов и папок, найденных в текущей директории, а также иконку папки
    var newDirDiv = document.createElement("div");
    //Добавляем нашему контейнеру класс для css и id для последующей замены методом replaceChild
    newDirDiv.classList.add("divOfDirs");
    newDirDiv.setAttribute("id", "dirForReplace");
    //Проходим по мапе с характеристиками папок из ответа сервера
    for (var i = 0; i < response["dirs"].length; i++) {
        //Создаём контейнер для иконки и текстового контента
        var dirAndIMG = document.createElement("div");
        dirAndIMG.classList.add("dirAndIMG");
        //Создаём и заполняем ссылку, содержащую название и размер папки
        var newDir = document.createElement("a");
        var dirName = makeDirName(response, i);
        var dirSize = makeDirSize(response, i);
        var newContent = document.createTextNode(dirName + " " + dirSize);
        newDir.append(newContent);
        //Добавляем ссылке класс для css и нужные в других местах свойства
        newDir.setAttribute("name", dirName);
        newDir.classList.add("directory");
        //Добавляем ссылке функцию-обработчик
        newDir.addEventListener('click', requestToServer_js_1.dirRequest);
        //Создаём img объект, добавляем ему ссылку на внешнее изображение и класс для css
        var newIMG = document.createElement("img");
        newIMG.setAttribute("src", "https://img.icons8.com/?size=512&id=44032&format=png");
        newIMG.setAttribute("alt", "folderImage");
        newIMG.classList.add("folderIMG");
        //Добавляем ссылку и изображение в наш контейнер
        dirAndIMG.append(newIMG);
        dirAndIMG.append(newDir);
        //Добавляем данный контейнер в родительский контейнер
        newDirDiv.append(dirAndIMG);
    }
    //Заменяем на странице текущий контейнер с папками на обновлённый
    var forReplace = document.getElementById("dirForReplace");
    var interactionField = document.getElementById("interactionField");
    if (interactionField != null && forReplace != null) {
        interactionField.replaceChild(newDirDiv, forReplace);
    }
    else {
        console.log("Ошибка в функции dirPageForming: не найден interactionField или forReplace");
    }
}
//Формирование файлов на странице
function filePageForming(response) {
    //Взятие имени файла из ответа сервера
    var makeFileName = function (data, i) {
        if (data["files"][i] != undefined)
            return data["files"][i]["name"];
        else
            return "";
    };
    //Взятие размера файла из ответа сервера
    var makeFileSize = function (data, i) {
        if (data["files"][i] != undefined)
            return "[" + data["files"][i]["size"] + " mb]";
        else
            return "";
    };
    //Проводим аналогичные с формирование папок действия, но для отображения файлов
    //Родительский контейнер
    var newFileDiv = document.createElement("div");
    newFileDiv.classList.add("divOfFiles");
    newFileDiv.setAttribute("id", "fileForReplace");
    for (var i = 0; i < response["files"].length; i++) {
        //Контейнер-наследник
        var fileAndIMG = document.createElement("div");
        fileAndIMG.classList.add("fileAndIMG");
        //Новый файл
        var newFile = document.createElement("a");
        var fileName = makeFileName(response, i);
        var fileSize = makeFileSize(response, i);
        var newContent = document.createTextNode(fileName + " " + fileSize);
        newFile.append(newContent);
        newFile.classList.add("file");
        //Иконка файла
        var newIMG = document.createElement("img");
        newIMG.setAttribute("src", "https://img.icons8.com/?size=512&id=44004&format=png");
        newIMG.setAttribute("alt", "fileImage");
        newIMG.classList.add("fileIMG");
        //Добавление иконки и характеристик файла в контейнер
        fileAndIMG.append(newIMG);
        fileAndIMG.append(newFile);
        //Добавление этого контейнера в родительский
        newFileDiv.append(fileAndIMG);
    }
    //Замена на странице старого родительского контейнера на новый
    var forReplace = document.getElementById("fileForReplace");
    var interactionField = document.getElementById("interactionField");
    if (interactionField != null && forReplace != null) {
        interactionField.replaceChild(newFileDiv, forReplace);
    }
    else {
        console.log("Ошибка в функции dirPageForming: не найден interactionField или forReplace");
    }
}
//Формирование путя на странице
function pathPageForming(response) {
    //Разделение пути к папке на составляющие
    var pathParsing = function (data, i) {
        if (data["dirs"][i] != undefined) {
            //Берём путь к папке из ответа сервера
            var pathString = data["dirs"][i]["path"];
            //Сепарируем его по дешу
            var pathArray_1 = pathString.split("/");
            //Не берём первый элемент, так как из-за сепарации по дешу он будет пустой строкой
            //Не берём последний элемент (имя папки)
            return pathArray_1.slice(1, pathArray_1.length - 1);
        }
        //Если в папке не было других директорий, то pathString будет пуста и мы не сможем получить путь
        //В таком случае к уже существующему путю прибавляем название папки, в которую мы перешли
        //Также проверяем, что данной папке в путе ещё нет (если пользователь нажмёт на эту же папку в путе)
        else {
            if (currentDirPath[currentDirPath.length - 1] != requestToServer_js_1.currentDir.slice(1)) {
                currentDirPath.push(requestToServer_js_1.currentDir.slice(1));
            }
            return currentDirPath;
        }
    };
    //создаём контейнер ссылок-путей (те, что находятся сверху рабочий области и имитирует путь в проводнике)
    var newDivPath = document.createElement("div");
    //Устанавливаем его класс для css и id для замены
    newDivPath.classList.add("divOfPath");
    newDivPath.setAttribute("id", "pathForReplace");
    //У всех папок, которые находятся на экране в текущий момент, один путь (кроме непосредственно названия папки)
    //Значит, мы можем взять любую из них и разобрать путь до неё на элементы.
    // Убрав последний (название папки), мы получим путь, который должен находиться вверху рабочей области
    var pathArray = pathParsing(response, 0);
    //Проходим по сформированном массиву, который хранит в своих ячейках имена папок. Формируем объекты для страницы
    for (var i = 0; i < pathArray.length; i++) {
        var newDir = document.createElement("a");
        var newContent = document.createTextNode("/" + pathArray[i]);
        newDir.append(newContent);
        //Добавляем класс для css и функцию-обработчик нажатия
        newDir.classList.add("pathDirectory");
        newDir.addEventListener('click', requestToServer_js_1.pathRequest);
        newDivPath.append(newDir);
    }
    //Заменяем на старый путь на странице
    var forReplace = document.getElementById("pathForReplace");
    var interactionField = document.getElementById("interactionField");
    if (interactionField != null && forReplace != null) {
        interactionField.replaceChild(newDivPath, forReplace);
    }
    else {
        console.log("Ошибка в функции dirPageForming: не найден interactionField или forReplace");
    }
    //Меняем наш текущий глобальный путь (используется в коде)
    exports.currentDirPath = currentDirPath = pathArray;
}
//Формирование времени выполнения на странице
function executionTimePageForming() {
    //Вычисляем время обработки запроса. Создаём на основе полученных данных объект <p>
    var end = Date.now();
    var executionTime = document.createElement("span");
    executionTime.setAttribute("id", "ex");
    executionTime.classList.add("executionTime");
    var newContent = document.createTextNode("\u0412\u0440\u0435\u043C\u044F \u0432\u044B\u043F\u043E\u043B\u043D\u0435\u043D\u0438\u044F: ".concat(end - requestToServer_js_1.start, " ms"));
    executionTime.append(newContent);
    //Заменяем старый объект <p> с временем выполнения запроса на новый
    var forReplace = document.getElementById("ex");
    var interactionField = document.getElementById("interactionField");
    if (interactionField != null && forReplace != null) {
        interactionField.replaceChild(executionTime, forReplace);
    }
    else {
        console.log("Ошибка в функции dirPageForming: не найден interactionField или forReplace");
    }
}
//Обработка ответа от сервера и запуск изменений на странице
function responseProcessing(serverResponseJSON) {
    var loader = new index_js_1.Loader(document.getElementById("content"), document.getElementById("loader"));
    //Показать страницу
    loader.hideLoader();
    //Парсинг ответа от сервера
    var response = JSON.parse(this.responseText);
    if (response["error"] != "None") {
        alert("Ошибка!");
    }
    else {
        //Формирование новых элементов на странице
        dirPageForming(response);
        filePageForming(response);
        pathPageForming(response);
        executionTimePageForming();
    }
}
exports.responseProcessing = responseProcessing;
