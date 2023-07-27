package main

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math"
	"net"
	"net/http"
	"os"
	"strings"
	"text/template"
	"time"

	"github.com/gorilla/mux"
	"github.com/rorex33/dirsizecalc"
)

// Функция для выделения из url путя к директории
func urlRootParse(url string) (string, error) {
	anch := 0
	for i := 0; i < len(url); i++ {
		if url[0:i] == "/dirsize?ROOT=" {
			anch = i
		}
		if url[i] == '&' {
			return url[anch:i], nil
		}
	}
	return "", errors.New("Ошибка в url")
}

// Возвращает текущий IP компьютера в сети (например: 192.168.1.0)
func getIP() string {
	conn, err := net.Dial("udp", "8.8.8.8:80")
	if err != nil {
		log.Fatal(err)
	}
	defer conn.Close()

	localAddr := strings.Split(conn.LocalAddr().String(), ":")

	return localAddr[0]
}

// Разбивает строку конфига на два строчные переменные: атрибут и его значение
func configStringParse(val string) (string, string) {
	i := 0
	for val[i] != ' ' {
		i++
	}
	name := val[0:i]
	for val[i] == ' ' || val[i] == '=' {
		i++
	}
	anch := i // "Якорь" для выделения части строки
	value := val[anch:]
	return name, value
}

// Функция считывает файл "server.config" и возвращает словарь из его атрибутов и их значений
func configRead() (map[string]string, error) {
	//Хранилище данных конфига в формате "атрибут":"значение"
	config := make(map[string]string)

	//Считываем конфиг
	file, err := os.Open("server.config")
	if err != nil {
		return config, err
	}
	defer file.Close()

	//Проходим по файлу, парсим его строки на атрибуты и их значения
	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		tempName, tempValue := configStringParse(scanner.Text())
		config[tempName] = tempValue
	}
	if err := scanner.Err(); err != nil {
		return config, err
	}

	return config, nil
}

// Приведение вещественного числа к виду с заданным количеством цифр после запятой.
func roundFloat(val float64, precision uint) float64 {
	ratio := math.Pow(10, float64(precision))
	return math.Round(val*ratio) / ratio
}

// Проверка верности входных параметров.
func validation(rootPath string, sortType string) error {
	if _, err := os.Stat(rootPath); os.IsNotExist(err) {
		err := errors.New("Ошибка валидации: неверный путь " + rootPath)
		return err
	}

	if sortType != "asc" && sortType != "desc" {
		err := errors.New("Ошибка валидации: неверный тип сортировки")
		return err
	}

	return nil

}

// Вывод в формате JSON
func outPut(dirsOutPutArray []dirsizecalc.NameSize, filesOutPutArray []dirsizecalc.NameSize, rootPath string) string {
	//Создание массива словарей, хранящих параметры найденных папок
	mapOfDirs := make([]map[string]string, len(dirsOutPutArray))
	for i := range dirsOutPutArray {
		//Временный словарь для добавления в итоговый JSON
		term := make(map[string]string)
		//Атрибуты "name" и "size" - берутся из переданного функции массива структур с полями "имя" и "размер"
		term["name"] = dirsOutPutArray[i].Name
		//Размер приводится к виду с двумя цифрами после запятой
		term["size"] = fmt.Sprint(roundFloat(dirsOutPutArray[i].Size, 2))
		//Атрибут путь формируется из переданного функции путя к директории и названия папки
		term["path"] = fmt.Sprintf("%s/%s", rootPath, string(dirsOutPutArray[i].Name))
		//Временный словарь добавляется в массив
		mapOfDirs[i] = term
	}

	//Создание массива словарей, хранящих параметры найденных файлов
	mapOfFiles := make([]map[string]string, len(filesOutPutArray))
	for i := range filesOutPutArray {
		//Временный словарь для добавления в итоговый JSON
		term := make(map[string]string)
		//Атрибуты "name" и "size" - берутся из переданного функции массива структур с полями "имя" и "размер"
		term["name"] = filesOutPutArray[i].Name
		//Размер приводится к виду с двумя цифрами после запятой
		term["size"] = fmt.Sprint(roundFloat(filesOutPutArray[i].Size, 2))
		//Временный словарь добавляется в массив
		mapOfFiles[i] = term
	}

	response := make(map[string]interface{})

	//Формирование ответа
	response["status"] = "1"
	response["error"] = "None"
	response["dirs"] = mapOfDirs
	response["files"] = mapOfFiles
	response["pathDirs"] = strings.Split(rootPath, "/")[1:]

	//Перевод ответа в json формат
	responseInJSON, _ := json.Marshal(response)
	return fmt.Sprintf("%s\n", responseInJSON)
}

// Вывод в формате JSON (при ошибке)
func errOutPut(err error) string {
	response := make(map[string]interface{})

	//Формирование ответа
	response["status"] = "0"
	response["error"] = fmt.Sprint(err)
	response["dirs"] = "Something gone wrong"
	response["pathDirs"] = "Something gone wrong"

	//Перевод ответа в json формат
	responseInJSON, _ := json.Marshal(response)
	fmt.Printf("%s\n", responseInJSON)
	return fmt.Sprintf("%s\n", responseInJSON)
}

// Хендлер-функция для нашего запроса. Парсит параметры, запускает их валидацию, вычисления размеров директорий и вывод результата.
func startCalculation(w http.ResponseWriter, r *http.Request) {
	//Парсинг параметров
	queries := r.URL.Query()
	url := fmt.Sprintf("%s", r.URL)
	//
	ROOT, _ := urlRootParse(url)
	sortType := strings.ToLower(queries["sort"][0])

	//Ответ на запрос
	var response string = ""

	//Проверка верности указанных параметров
	err := validation(ROOT, sortType)
	if err != nil {
		response = errOutPut(err)
		fmt.Println(err)
	} else {
		//Создаём срез, в котором будут храниться имена и размеры всех папок, находящихся в указанной директории
		//Также создаём срез всех файлов указанной директории
		dirNameSizeArray, filesDirSizeArray, err := dirsizecalc.GetContent(ROOT)
		//Сортируем наши срезы
		dirsizecalc.Sorting(dirNameSizeArray, filesDirSizeArray, sortType)
		if err != nil {
			response = errOutPut(err)
		} else {
			response = outPut(dirNameSizeArray, filesDirSizeArray, ROOT)
		}
	}

	//Загрузка служебных параметров в хедер ответа (без которых некоторые браузеры не примут ответ)
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.WriteHeader(http.StatusOK)

	//Вывод ответа
	w.Write([]byte(response))
}

func big(w http.ResponseWriter, r *http.Request) {
	tmpl, _ := template.ParseFiles("public/index.html")
	tmpl.Execute(w, "")
}

func main1() {
	//Создаём роутер и добавляем его параметры
	r := mux.NewRouter()

	//
	// r.HandleFunc("/dirsize", startCalculation).
	// 	Queries("ROOT", "{ROOT}").
	// 	Queries("sort", "{sort}").
	// 	Methods("GET", "OPTIONS")

	//
	r.HandleFunc("/dirsize", startCalculation)
	// r.PathPrefix("/").Handler(http.FileServer(http.Dir("public")))
	// ui := http.FileServer(http.Dir("/home/ivan/Desktop/TypeScript/servermaking/public"))
	// r.Handle("/", http.StripPrefix("/", ui))
	r.HandleFunc("/", big)
	r.PathPrefix("/public/").Handler(http.StripPrefix("/public/", http.FileServer(http.Dir("./public"))))

	//Чтение конфига
	config, err := configRead()
	if err != nil {
		fmt.Println("Ошибка при чтении конфига ", err)
		config = map[string]string{}
	}

	//Создаём сервер
	serverAddress := fmt.Sprintf("%s:%s", getIP(), config["port"])
	server := &http.Server{
		Addr:         serverAddress,
		Handler:      r,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	//Запускаем сервер
	log.Printf("Listening on %s \n", serverAddress)
	err = server.ListenAndServe()
	if err != nil {
		fmt.Println("Server error")
	}
}
