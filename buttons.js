document.addEventListener("DOMContentLoaded", showPage);

function showLoader(){
    document.getElementById("content").style.visibility = "hidden";
    document.getElementById("loader").style.visibility = "visible";
}

function showPage(){
    document.getElementById("content").style.visibility = "visible";
    document.getElementById("loader").style.visibility = "hidden";
}

let start
let end

//Подключение начальной кнопки перехода в корневую директорию
const enter = document.querySelector('.enter');

//Подключение селектора сортировки
const sortType = document.querySelector('.sortSelector');

//Обработка нажатия на начальную кнопку
enter.onclick = pathButtonRequest;

//Путь к текущему местонахождению, разбитый по сепаратору "/" и сохранённый в массив
let currentDirPath = []

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
        if (rootPathArray.length == 0) {rootPath = "/home"}
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
    let headPart = "http://localhost:3003/dirsize?"
    let tailPart = "&limit=1&sort=" + sortTail
    let ROOT = "ROOT=" + rootPath
    let url = headPart + ROOT + tailPart
    return  url
}

//Функция-обработчик нажатия на кнопку-путь (те, что сверху рабочей области)
function pathButtonRequest(){
    start = Date.now();
    showLoader();
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
    xhr.addEventListener("load", processing)
    xhr.open("GET", url)
    xhr.send();
}

//Функция-обработчик нажатия на кнопку-папку
function dirButton(){
    start = Date.now();
    showLoader();
    //Получаем имя папки, на которую нажали, и формируем на её основе ссылку
    let currentDir = this.getAttribute("name")
    url = urlCreation(currentDirPath, sortType.value, currentDir, 2)
    //GET запрос по нашему url
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load",processing)
    xhr.open("GET", url)
    xhr.send();
}

//Обработка ответа от сервера и соответствующее изменение текста на странице
function processing(data){
    showPage()
    //Парсинг ответа от сервера
    response = JSON.parse(this.responseText)
    if (response["error"] != "None"){alert("Ошибка!")}
    else{

        //Формируем div, который будет содержать имена файлов и папок, найденных в текущей директории
        //Сами контейнеры имён и размеров являются кнопками
        const newDirDiv = document.createElement("div");

        //Добавляем нашему контейнеру класс для css и id для последующей замены методом replaceChild
        newDirDiv.classList.add("divOfDirs")
        newDirDiv.setAttribute("id", "dirForReplace")

        //Проходим по мапе с характеристиками папок из ответа сервера
        for (i = 0; i < response["dirs"].length; i++){
            //Создаём и заполняем кнопку
            newDir = document.createElement("a");
            let dirName = makeDirName(response,i)
            let dirSize = makeDirSize(response,i)
            newContent = document.createTextNode(dirName + " " + dirSize)
            newDir.append(newContent)

            //Добавляем кнопке класс для css и нужные в других местах свойства
            newDir.classList.add("directory")
            newDir.setAttribute("name", dirName)

            //Добавляем кнопке функцию-обработчик
            newDir.addEventListener('click', dirButton)

            //Добавляем кнопку в наш div
            newDirDiv.append(newDir);    
        }
        //Заменяем на странице текущий контейнер с папками на обновлённый
        let forReplace = document.getElementById("dirForReplace");
        let interactionField = document.getElementById("interactionField");
        interactionField.replaceChild(newDirDiv, forReplace);

        //Проводим аналогичные действия, но для отображения файлов
        const newFileDiv = document.createElement("div");
        newFileDiv.classList.add("divOfFiles")
        newFileDiv.setAttribute("id", "fileForReplace")
        for (i = 0; i < response["files"].length; i++){
            newFile = document.createElement("a");
            let fileName = makeFileName(response,i)
            let fileSize = makeFileSize(response,i)
            newContent = document.createTextNode(fileName + " " + fileSize);
            newFile.append(newContent);
            newFile.classList.add("file")
            newFileDiv.append(newFile);    
        }
        forReplace = document.getElementById("fileForReplace");
        interactionField = document.getElementById("interactionField");
        interactionField.replaceChild(newFileDiv, forReplace);

        //создаём контейнер кнопок-путей (те, что находятся сверху рабочий области и имитирует путь в проводнике)
        const newDivPath = document.createElement("div");

        //Устанавливаем его класс для css и id для замены
        newDivPath.classList.add("divOfPath")
        newDivPath.setAttribute("id", "divPath")

        //У всех папок, которые находятся на экране в текущий момент, один путь (кроме непосредственно названия папки)
        //Значит, мы можем взять любую из них и разобрать путь до неё на элементы.
        // Убрав последний (название папки), мы получим путь, который должен находиться вверху рабочей области
        let pathArray = pathParsing(response,0)
        
        //Проходим по сформированном массиву, который хранит в своих ячейках имена папок. Формируем кнопки для страницы
        for (i = 0; i < pathArray.length; i++){
            newDir = document.createElement("a");
            newContent = document.createTextNode("/" + pathArray[i]);
            newDir.append(newContent);

            //Добавляем класс для css и функцию-обработчик нажатия
            newDir.classList.add("pathDirectory")
            newDir.addEventListener('click', pathButtonRequest)
            newDivPath.append(newDir);   
        }
        forReplace = document.getElementById("divPath");
        interactionField = document.getElementById("interactionField");
        interactionField.replaceChild(newDivPath, forReplace);

        //Меняем наш текущий глобальный путь
        currentDirPath = pathArray

        end = Date.now()
        const executionTime = document.createElement("p");
        executionTime.setAttribute("id", "ex")
        executionTime.classList.add("executionTime")
        newContent = document.createTextNode(`Время выполнения: ${end - start} ms`);
        executionTime.append(newContent)
        forReplace = document.getElementById("ex");
        interactionField = document.getElementById("interactionField");
        interactionField.replaceChild(executionTime, forReplace);
    }
}


//Взятие имени файла из распаршенного ответа сервера
function makeFileName(data, i){
    if (data["files"][i] != undefined) return data["files"][i]["name"]
    else return ""
}

//Взятие размера файла из распаршенного ответа сервера
function makeFileSize(data, i){
    if (data["files"][i] != undefined) return "[" + data["files"][i]["size"] + " mb]"
    else return ""
}


//Взятие имени папки из распаршенного ответа сервера
function makeDirName(data, i){
    if (data["dirs"][i] != undefined) return "/" + data["dirs"][i]["name"]
    else return ""
}

//Взятие размера папки папки из распаршенного ответа сервера
function makeDirSize(data, i){
    if (data["dirs"][i] != undefined) return "[" + data["dirs"][i]["size"] + " mb]"
    else return ""
}

//Разделение пути к папке на составляющие
function pathParsing(data, i){
    if (data["dirs"][i] != undefined){
        //Берём путь к папке из ответа сервера
        let pathString = data["dirs"][i]["path"]

        //Сепарируем его по дешу
        pathArray = pathString.split("/")

        //Не берём первый элемент, так как из-за сепарации по дешу он будет пустой строкой
        //Не берём последний элемент (имя папки)
        return pathArray.slice(1, pathArray.length-1)
    }
    //Если во время вызова пути к папке не обнаружено, значит необходимо вернуть текущий путь
    else return currentDirPath
}