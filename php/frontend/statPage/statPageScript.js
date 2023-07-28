"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tableForming = void 0;
function tableForming(response) {
    var xhr = new XMLHttpRequest();
    xhr.addEventListener("load", makeTable);
    xhr.open("GET", '/stat/stat.php');
    xhr.send();
}
exports.tableForming = tableForming;
function makeTableHead(headTR) {
    var thId = document.createElement("th");
    var thPath = document.createElement("th");
    var thTotal_size = document.createElement("th");
    var thCount_files = document.createElement("th");
    var thTime = document.createElement("th");
    var thDate = document.createElement("th");
    thId.append("id");
    thPath.append("Путь к директории сервера");
    thTotal_size.append("Размер директории сервера");
    thCount_files.append("Найдено файлов");
    thTime.append("Время обработки запроса сервером (в мс)");
    thDate.append("Дата запроса");
    headTR.append(thId, thPath, thTotal_size, thCount_files, thTime, thDate);
}
function makeTable(responseJSON) {
    var response = JSON.parse(this.responseText);
    var mainTable = document.createElement('table');
    mainTable.classList.add("statTable");
    mainTable.setAttribute("id", "statTable");
    var caption = document.createElement("caption");
    caption.append("Статистика всех обращений к вычисляющему серверу");
    var headTR = document.createElement("tr");
    makeTableHead(headTR);
    mainTable === null || mainTable === void 0 ? void 0 : mainTable.append(headTR);
    if (mainTable == null) {
        alert("Таблица не загрузилась");
    }
    else {
        for (var i = 1; i < response.length; i++) {
            var tr = document.createElement("tr");
            var tdId = document.createElement("td");
            var tdPath = document.createElement("td");
            var tdTotal_size = document.createElement("td");
            var tdCount_files = document.createElement("td");
            var tdTime = document.createElement("td");
            var tdDate = document.createElement("td");
            tdId.append(response[i]["id"]);
            tdPath.append(response[i]["path"]);
            tdTotal_size.append(response[i]["total_size"]);
            tdCount_files.append(response[i]["count_files"]);
            tdTime.append(response[i]["time"]);
            tdDate.append(response[i]["date"]);
            tr.append(tdId, tdPath, tdTotal_size, tdCount_files, tdTime, tdDate);
            mainTable.append(tr);
        }
        var forReplace = document.getElementById("statTable");
        var parentDiv = document.getElementById("parent");
        if (parentDiv != null && forReplace != null) {
            parentDiv.replaceChild(mainTable, forReplace);
        }
        else {
            console.log("Ошибка в функции dirPageForming: не найден interactionField или forReplace");
        }
    }
}
