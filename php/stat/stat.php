<?php
// Распознаём запрос
function main(){
    $entityBody = file_get_contents('php://input');
    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        putStat();
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
        getStat();
    }
}

// Декодируем содержимое PUT запроса от микросервиса на golang
function getPostContent() {
    if(!empty($_POST)) {
        return $_POST;
    }
    // Сработает при использовании application/json в качестве HTTP Content-Type в запросе 
    $post = json_decode(file_get_contents('php://input'), true);
    if(json_last_error() == JSON_ERROR_NONE) {
        return $post;
    }
    return [];
}

// Обрабатываем PUT запрос от микросервиса на golang
function putStat() {
    $entityBody = file_get_contents('php://input');
    $request = getPostContent();

    // Парсим запрос на переменные, добавляем к ним кавычки (иначе mysql не примет запрос)
    $path = '"' . $request["path"] . '"';
    $total_size = '"' . $request["total_size"] . '"' ;
    $count_files = '"' . $request["count_files"] . '"';
    $time = '"' . $request["time"] . '"';
    $date = '"' . $request["date"] . '"';

    // Данные для подключения к СУБД
    $servername = "localhost";
    $username = "user";
    $password = "Password.1";

    // Подключаемся к СУБД
    $conn = mysqli_connect($servername, $username, $password, "STATS_DB");
    if ($conn === false) {
        die("Ошибка: " . mysqli_connect_error());
    } 

    // Делаем SQL запрос к СУБД (добавляем в неё данные)
    $sql = "INSERT INTO t_stat (path, total_size, count_files, time, date) 
    VALUES ($path, $total_size, $count_files, $time, $date)";
    if ($conn->query($sql) === TRUE) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    //Закрываем соединение
    mysqli_close($conn);
}

// Обрабатываем GET запрос от фронтенда
function getStat(){

    // Данные для подключения к СУБД
    $servername = "localhost";
    $username = "user";
    $password = "Password.1";

    // Подключаемся к СУБД
    $conn = mysqli_connect($servername, $username, $password, "STATS_DB");
    if ($conn === false) {
        die("Ошибка: " . mysqli_connect_error());
    } 

    //Переменная для принятия ответа СУБД
    $response = array(array());

    // Делаем SQL запрос к СУБД (запрашиваем данные)
    $sql = "SELECT * FROM t_stat";
    if($result = $conn->query($sql)){
        foreach($result as $row){
                $temp = array(
                    "id" => $row["id"],
                    "path" => $row["path"],
                    "total_size" => $row["total_size"],
                    "count_files" => $row["count_files"],
                    "time" => $row["time"],
                    "date" => $row["date"],
                );
                array_push($response, $temp);
            }
        $result->free();
    } else {
        echo "Ошибка: " . $conn->error;
    }

    //Передаём ответ от субд фронтенду
    echo json_encode($response);
}


main();

?>