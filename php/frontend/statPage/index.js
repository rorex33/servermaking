"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var statPageScript_js_1 = require("./statPageScript.js");
window.addEventListener("DOMContentLoaded", startStatPage);
function startStatPage() {
    var getStatsButton = document.getElementById('getStatsButton');
    if (getStatsButton != null) {
        getStatsButton.addEventListener("click", statPageScript_js_1.tableForming);
    }
    else {
        console.log("Не найдена кнопка выдачи статистики");
    }
}
