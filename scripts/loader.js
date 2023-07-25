//Убрать страницу, показать колесо загрузки
function showLoader(){
    document.getElementById("content").style.visibility = "hidden";
    document.getElementById("loader").style.visibility = "visible";
}

//Убрать колесо загрузки, показать страницу
function showPage(){
    document.getElementById("content").style.visibility = "visible";
    document.getElementById("loader").style.visibility = "hidden";
}

export {showLoader, showPage}