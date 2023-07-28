<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="./public/style.css" rel="stylesheet">
    <title>Searcher</title>
</head>
<div class="loader" id="loader"></div>
<body id="content">
    <header>
    <section id="constHeaderElem">
        <select class="sortSelector" size="1">
                <option value="asc">Выберите тип сортировки</option>
                <option value="asc">По возрастанию</option>
                <option value="desc">По убыванию</option>
        </select> 
        <button class="goToStatButton" onclick="null"><a href="/public/stat.html" class="goToStatRef">Статистика</a></button>
    </section>
    </header>
    <main>
        <section class="interactionField" id = "interactionField">
            <h4 class ="fieldName">Поиск директорий</h4>
            <div id="pathForReplace" class="pathForReplace"> <!-- JS будет менять содержимое данного контейнера -->
                <button class="enterButton">Отправиться в корневую директорию</button>
            </div>
            <span class="executionTime" id="ex"></span> 
            <span class="constText">Найдены следующие директории:</span>
            <div id ="dirForReplace"> <!-- JS будет менять содержимое данного контейнера -->
                <span class="tempText">Пока ничего не найдено.</span>
            </div>
            <span class="constText">Найдены следующие файлы:</span>
            <div id ="fileForReplace"> <!-- JS будет менять содержимое данного контейнера -->
                <span class="tempText">Пока ничего не найдено.</p>
            </div>
        </section>
    </main>
    <footer>     
        <article class="guideText">    
            <h5>Инструкция: </h5>
            <p> Данный веб-интерфейс выводит содержимое указанной вами директории сервера. Путь к текущей директории можно
                увидеть в верху рабочей области. Он интерактивный, вы можете перемещаться по нему нажатием на соответствующую
                директорию.
            </p>
            <p>
                Найденные директории также интерактивны и доступны для нажатия.
            </p>
            <p>
                Перед началом работы не забудьте выбрать тип сортировки,
                так как по умолчанию будет выбрана сортировка по убыванию.
            </p>
            <p>
                Для начала работы нажмите кнопку <b>"Отправиться в корневую директорию."</b>
            </p>
        </article>
    </footer>

    <script src="./public/mainPage.js"></script>
</body>
</html>