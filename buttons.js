//Колесо загрузки страницы
document.onreadystatechange = function () {
    if (document.readyState !== "complete") {
        document.querySelector(
            "body").style.visibility = "hidden";
        document.querySelector(
            "#loader").style.visibility = "visible";
    } else {
        document.querySelector(
            "#loader").style.display = "none";
        document.querySelector(
            "body").style.visibility = "visible";
    }
};

//Показывает колесо ожидания
function showWaiting(){
    document.querySelector(
        "body").style.visibility = "hidden";
    document.querySelector(
        "#loader").style.visibility = "visible";
}

///Скрывает колесо ожидания
function hideWaiting(){
    document.querySelector(
        "#loader").style.display = "none";
    document.querySelector(
        "body").style.visibility = "visible";
}

//Подключение кнопок-путей
const path1 = document.querySelector('.path1');
const path2 = document.querySelector('.path2');
const path3 = document.querySelector('.path3');
const path4 = document.querySelector('.path4');
const path5 = document.querySelector('.path5');

//Подключение кнопок-папок
const dir1 = document.querySelector('.dir1');
const dir2 = document.querySelector('.dir2');
const dir3 = document.querySelector('.dir3');
const dir4 = document.querySelector('.dir4');
const dir5 = document.querySelector('.dir5');

//Подключения текста, окружающего кнопки-папки
const dir1text = document.querySelector('.dir1text');
const dir2text = document.querySelector('.dir2text');
const dir3text = document.querySelector('.dir3text');
const dir4text = document.querySelector('.dir4text');
const dir5text = document.querySelector('.dir5text');

//Подключение кнопки "назад"
const back = document.querySelector('.backButton');

//Подключение селектора сортировки
const sortType = document.querySelector('.sort');

//Обработка нажатия на кнопку-путь
path1.onclick = pathButtonRequest;
path2.onclick = pathButtonRequest;
path3.onclick = pathButtonRequest;
path4.onclick = pathButtonRequest;
path5.onclick = pathButtonRequest;

//Обработка нажатия на кнопку-папку
dir1.onclick = dirButton;
dir2.onclick = dirButton;
dir3.onclick = dirButton;
dir4.onclick = dirButton;
dir5.onclick = dirButton;

//Обработка нажатия на кнопку "назад"
back.onclick = backButton;

//Путь к текущему местонахождению, разбитый по сепаратору "/" и сохранённый в массив
let globalPath =[]

//Создание ссылки для запроса к серверу
function urlCreation(rootPath, sortTail){
    let headPart = "http://localhost:3003/dirsize?"
    let tailPart = "&limit=1&sort=" + sortTail
    let ROOT = "ROOT=" + rootPath
    let url = headPart + ROOT + tailPart
    return  url
}

//Функция-обработчик нажатия на кнопку-путь
function pathButtonRequest(){
    //showWaiting()
    if (this.textContent[0]!="/") {
        url = urlCreation("/home", sortType.value)
    }
    else {
        url = urlCreation(globalPathMaking("pathButton",this.textContent), sortType.value)
    }
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load",pathProccesing)
    xhr.open("GET", url)
    xhr.send();
}

//Функция-обработчик нажатия на кнопку-папку
function dirButton(){
    //showWaiting()
    url = urlCreation(globalPathMaking("dirButton", "nothing") + this.textContent, sortType.value)
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load",pathProccesing)
    xhr.open("GET", url)
    xhr.send();
}

//Функция-обработчик нажатия на кнопку "назад"
function backButton(){
    //showWaiting()
    url = urlCreation(globalPathMaking("backButton", "nothing"), sortType.value)
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load",pathProccesing)
    xhr.open("GET", url)
    xhr.send();
}

//Заполнение массива текущего пути
function globalPathMaking(type, data){
    let s = ""
    if (type == "dirButton"){
        for (let i = 0; i < globalPath.length; i++) {
            if (globalPath[i]!=""){
                s+= globalPath[i]
            }
        }
        return s
    }
    if (type == "backButton"){
        for (let i = 0; i < globalPath.length-1; i++) {
            if (globalPath[i+1]!=""){
                s+= globalPath[i]
            }
        }
        return s
    }
    if (type == "pathButton"){
        for (let i = 0; i < globalPath.length-1; i++) {
            if (globalPath[i]==data){
                s+= globalPath[i]
                break
            }
            else{
                s+= globalPath[i]
            }
        }
        return s
    }
}

//Взятие пути к папки из распаршенного ответа сервера
function makePath(data, i){
    if (data["pathDirs"][i] != undefined) return "/" + data["pathDirs"][i]
    return ""
}

//Взятие имени папки из распаршенного ответа сервера
function makeDirName(data, i){
    if (data["dirs"][i] != undefined) return "/" + data["dirs"][i]["name"]
    else return ""
}

//Взятие размера папки папки из распаршенного ответа сервера
function makeDirSize(data, i){
    if (data["dirs"][i] != undefined) return data["dirs"][i]["size"] + " mb"
    else return ""
}

//Обработка ответа от сервера и соответствующее изменение текста на странице
function pathProccesing(data){
    hideWaiting()
    //Парсинг ответа от сервера
    a = JSON.parse(this.responseText)
    if (a["error"] != "None"){alert("Ошибка!")}
    else{

        //Создание текста для кнопки-пути
        path1.textContent = makePath(a,0)
        //Добавление этого текста в массив текущего пути
        globalPath[0] = path1.textContent
        //Создание текста для кнопки-папки
        dir1.textContent = makeDirName(a,0)
        //Создание текста для текста, окружающего кнопку-папку
        dir1text.textContent = makeDirSize(a,0)
        
        //Аналогичные операции для остальных кнопок

        path2.textContent = makePath(a,1)
        globalPath[1] = path2.textContent
        dir2.textContent = makeDirName(a,1)
        dir2text.textContent = makeDirSize(a,1)

        path3.textContent = makePath(a,2)
        globalPath[2] = path3.textContent
        dir3.textContent = makeDirName(a,2)
        dir3text.textContent = makeDirSize(a,2)

        path4.textContent = makePath(a,3)
        globalPath[3] = path4.textContent
        dir4.textContent = makeDirName(a,3)
        dir4text.textContent = makeDirSize(a,3)

        path5.textContent = makePath(a,4)
        globalPath[4] = path5.textContent
        dir5.textContent = makeDirName(a,4)
        dir5text.textContent = makeDirSize(a,4)
    }
}