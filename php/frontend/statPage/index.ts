import {tableForming} from "./statPageScript.js";

window.addEventListener("DOMContentLoaded", startStatPage)

function startStatPage(){
    // После загрузки страницы находим на ней кнопку получения статистики
    // и ставим на неё обращение к базе данных через php
    const getStatsButton = document.getElementById('getStatsButton');
    if (getStatsButton != null){
        getStatsButton.addEventListener("click", tableForming)
    } else {
        console.log("Не найдена кнопка выдачи статистики")
    }
}