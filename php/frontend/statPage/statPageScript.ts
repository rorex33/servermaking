//Делаем запрос к php файлу
function tableForming(response){
    const xhr = new XMLHttpRequest();
    xhr.addEventListener("load", makeTable)
    xhr.open("GET", '/stat/stat.php')
    xhr.send();
}

// Создаём первую строку таблицы (заглавия)
function makeTableHead(headTR){
    let thId: HTMLSpanElement = document.createElement("th");
    let thPath: HTMLSpanElement = document.createElement("th");
    let thTotal_size: HTMLSpanElement = document.createElement("th");
    let thCount_files: HTMLSpanElement = document.createElement("th");
    let thTime: HTMLSpanElement = document.createElement("th");
    let thDate: HTMLSpanElement = document.createElement("th");
    thId.append("id")
    thPath.append("Путь к директории сервера")
    thTotal_size.append("Размер директории сервера")
    thCount_files.append("Найдено файлов")
    thTime.append("Время обработки запроса сервером (в мс)")
    thDate.append("Дата запроса")

    headTR.append(thId, thPath, thTotal_size, thCount_files, thTime, thDate)
}

// Строим таблицу
function makeTable(responseJSON){
    //Парсим ответ от php
    let response = JSON.parse(this.responseText)

    // Создаём таблицу
    const mainTable = document.createElement('table');
    mainTable.classList.add("statTable")
    mainTable.setAttribute("id","statTable")

    // Добавляем её название
    let caption = document.createElement("caption")
    caption.append("Статистика всех обращений к вычисляющему серверу")

    // Создаём первую строку (заглавия)
    let headTR = document.createElement("tr")
    makeTableHead(headTR)
    mainTable?.append(headTR)

    if (mainTable == null){
        alert("Таблица не загрузилась")
    } else{
        // Заполняем таблицу:
        // 1) Создаём заготовки строки и ячеек
        // 2) Добавляем в ячейки текст из ответа от php
        // 3) Добавляем ячейки в строку
        // 4) Добавляем строку в таблицу
        for (let i = 1; i < response.length; i++){
            // 1
            let tr: HTMLSpanElement = document.createElement("tr");
            let tdId: HTMLSpanElement = document.createElement("td");
            let tdPath: HTMLSpanElement = document.createElement("td");
            let tdTotal_size: HTMLSpanElement = document.createElement("td");
            let tdCount_files: HTMLSpanElement = document.createElement("td");
            let tdTime: HTMLSpanElement = document.createElement("td");
            let tdDate: HTMLSpanElement = document.createElement("td");
            // 2
            tdId.append(response[i]["id"])
            tdPath.append(response[i]["path"])
            tdTotal_size.append(response[i]["total_size"])
            tdCount_files.append(response[i]["count_files"])
            tdTime.append(response[i]["time"])
            tdDate.append(response[i]["date"])
            // 3
            tr.append(tdId, tdPath, tdTotal_size, tdCount_files, tdTime, tdDate)
            // 4
            mainTable.append(tr)
        }
        // Меняем старую таблицу на странице на новую
        const forReplace: HTMLElement | null = document.getElementById("statTable");
        const parentDiv: HTMLElement | null = document.getElementById("parent");
        if (parentDiv!=null && forReplace!=null){
            parentDiv.replaceChild(mainTable, forReplace);
        } else {
            console.log("Ошибка в функции makeTable: не найден parentDiv или forReplace")
        }
    }
}

// Пример ответа от php: 
// [[],{"id":"1","path":"\/test","total_size":"0","count_files":"0","time":"12","date":"2016-05-21"},
// {"id":"2","path":"\/home","total_size":"1","count_files":"1","time":"5","date":"2020-10-10"},
// {"id":"3","path":"\/home","total_size":"1","count_files":"1","time":"5","date":"2020-10-10"},
// {"id":"4","path":"\/home","total_size":"2","count_files":"10","time":"5","date":"2020-10-10"},

export {tableForming}