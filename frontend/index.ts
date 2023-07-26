import { pathRequest } from "./components/requestToServer";

class Loader {
    contentFromPage: HTMLElement | null
    loaderFromPage: HTMLElement | null
    constructor(contentID, loaderID){
        this.contentFromPage = contentID
        this.loaderFromPage = loaderID
    }
    showLoader(){
        if (this.contentFromPage != null && this.loaderFromPage != null){
            this.contentFromPage.style.visibility = "hidden";
            this.loaderFromPage.style.visibility = "visible";
        } else {
            console.log('Ошибка при вызове метода "showLoader" объекта класса "Loader"')
        }
    }
    hideLoader(){
        if (this.contentFromPage != null && this.loaderFromPage != null){
            this.contentFromPage.style.visibility = "visible";
            this.loaderFromPage.style.visibility = "hidden";
        } else {
            console.log('Ошибка при вызове метода "hideLoader" объекта класса "Loader"')
        }
    }
}
window.addEventListener("DOMContentLoaded", start)
function start(){
    const loader = new Loader(document.getElementById("content"), document.getElementById("loader"))
    loader.hideLoader()

    //Подключение начальной кнопки перехода в корневую директорию
    const enterButton: Element | null = document.querySelector('.enterButton');

    //Обработка нажатия на начальную кнопку
    if (enterButton!=null){
        enterButton.addEventListener("click", pathRequest);
    } else {
        console.log('Не найдена кнопка входа ("enterButton")')
    }
}
export {Loader}