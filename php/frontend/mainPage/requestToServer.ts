import {responseProcessing, currentDirPath} from "./pageChanging.js"
import { Loader } from "./index.js";

//Подключение селектора сортировки
const sortType = <HTMLInputElement>document.querySelector('.sortSelector');
sortType.addEventListener("click", selectorRequest)

//Переменные для подсчёта времени выполнения запросов
let start

let currentDir

//Общение с сервером
//
//
//Создание ссылки для запроса к серверу
function urlCreation(rootPathArray, sortTail, dirName, type){
    
    // rootPathArray - наше текущее местонахождение
    // sortTail - тип сортировки (в ссылке он идёт самым последним аргументом, поэтому "tail")
    // dirName - передаём название папки, в которую мы хотим перейти
    // type = 1, если мы перешли по кнопкам, образующим путь в верхней части рабочей области.
    // type = 2, если мы нажали на одну из найденных директорий

    //Итоговый путь, который будет добавлен в ссылку
    let rootPath = ""

    if (type == 1){
        //Если текущий путь пуст, то устанавливаем путь в корень системы
        if (rootPathArray.length == 0) {rootPath = "/"}
        //Иначе находим, на какую часть текущего путя мы нажали, и образуем на его основе путь для ссылки
        else {
            let i = 0
            while ("/" + rootPathArray[i]!=dirName){
                i++
            }
            rootPath = "/" + rootPathArray.slice(0,i+1).join("/")
        }
    }
    if (type==2){
        //Если текущий путь пуст, то устанавливаем путь в корень системы
        if (rootPathArray.length == 0) {rootPath = "/home"}
        //Иначе прибавляем к текущему путю директорию, на которую мы нажали, и образуем на его основе путь для ссылки
        else {
            rootPath = "/" + rootPathArray.join("/") + dirName
        }
    }
    //Образование ссылки
    const headPart = "http://192.168.81.50:8080/dirsize?"
    const tailPart = "&sort=" + sortTail
    const ROOT = "ROOT=" + rootPath
    let url = headPart + ROOT + tailPart
    return  url
}

//Функция-обработчик нажатия на путь
function pathRequest(){
    if (sortType == null){
        console.log('Ошибка в функции "pathRequest": селектор выбора сортировки не был найден')
        return
    }

    let url = ""
    //Начать отчёт выполнения запроса
    start = Date.now();
    //Показать колесо загрузки и скрыть страницу
    const loader = new Loader(document.getElementById("content"), document.getElementById("loader"))
    loader.showLoader();
    //Формирование ссылки, Если вместо путя у нас приветственная надпись
    if (this.textContent[0]!="/") {
        url = urlCreation([], sortType.value, this.textContent, 1)
    }
    //Формирование ссылки в любом другом случае (когда путь уже есть)
    else {
        url = urlCreation(currentDirPath, sortType.value, this.textContent, 1)
    }
    //GET запрос по нашему url
    const xhr = new XMLHttpRequest();
    console.log(url)
    xhr.addEventListener("load", responseProcessing)
    xhr.open("GET", url)
    xhr.send();
}

//Функция-обработчик нажатия на папку
function dirRequest(){
    let url = ""
    //Начать отчёт выполнения запроса
    start = Date.now();
    //Показать колесо загрузки и скрыть страницу
    const loader = new Loader(document.getElementById("content"), document.getElementById("loader"))
    loader.showLoader();
    //Получаем имя папки, на которую нажали, и формируем на её основе ссылку
    currentDir = this.getAttribute("name")
    url = urlCreation(currentDirPath, sortType.value, currentDir, 2)
    //GET запрос по нашему url
    const xhr = new XMLHttpRequest();
    console.log(url)
    xhr.addEventListener("load",responseProcessing)
    xhr.open("GET", url)
    xhr.send();
}

function selectorRequest(){
    let url = ""
    //Начать отчёт выполнения запроса
    start = Date.now();
    //Показать колесо загрузки и скрыть страницу
    const loader = new Loader(document.getElementById("content"), document.getElementById("loader"))
    loader.showLoader();
    //Получаем имя папки, на которую нажали, и формируем на её основе ссылку
    currentDir = this.getAttribute("name")
    url = urlCreation(currentDirPath, sortType.value, "", 2)
    //GET запрос по нашему url
    const xhr = new XMLHttpRequest();
    console.log(url)
    xhr.addEventListener("load",responseProcessing)
    xhr.open("GET", url)
    xhr.send();
}

export {pathRequest, dirRequest, start, currentDir};