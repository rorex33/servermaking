package main

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"

	"github.com/gorilla/mux"
	"github.com/rorex33/dirsizecalc"
)

// Класс ASC сортировки
type BySizeASC []dirsizecalc.NameSize

func (a BySizeASC) Len() int           { return len(a) }
func (a BySizeASC) Less(i, j int) bool { return a[i].Size < a[j].Size }
func (a BySizeASC) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

// Класс DESC сортировки
type BySizeDESC []dirsizecalc.NameSize

func (a BySizeDESC) Len() int           { return len(a) }
func (a BySizeDESC) Less(i, j int) bool { return a[i].Size > a[j].Size }
func (a BySizeDESC) Swap(i, j int)      { a[i], a[j] = a[j], a[i] }

//
//

// Разбивает строку конфига на две строки: атрибут и его значение
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

// Приведение вещественного числа к виду с заданным количеством цифр после запятой.
func roundFloat(val float64, precision uint) float64 {
	ratio := math.Pow(10, float64(precision))
	return math.Round(val*ratio) / ratio
}

// Проверка верности входных параметров.
func validation(rootPath string, limit float64, sortType string) error {
	if _, err := os.Stat(rootPath); os.IsNotExist(err) {
		err := errors.New("Ошибка валидации: неверный путь " + rootPath)
		return err
	}

	if limit < 0 {
		err := errors.New("Ошибка валидации: неверный лимит")
		return err
	}

	if sortType != "asc" && sortType != "desc" {
		err := errors.New("Ошибка валидации: неверный тип сортировки")
		return err
	}

	return nil

}

// Сортировка и вывод в формате JSON
func output(outPutArray []dirsizecalc.NameSize, rootPath string, limit float64, sortType string) string {
	//Сортировка
	if sortType == "asc" {
		sort.Sort(BySizeASC(outPutArray))
	} else {
		sort.Sort(BySizeDESC(outPutArray))
	}

	//Создание массива мапы, хранящей параметры найденных папок
	mapOfDirs := make([]map[string]string, len(outPutArray))
	for i := range outPutArray {

		//Временная мапа для добавления в массив
		term := make(map[string]string)

		//Атрибуты "name" и "size" - берутся из переданного функции массива структур с полями "имя" и "размер"
		term["name"] = outPutArray[i].Name
		//Размер приводится к виду с двумя цифрами после запятой
		term["size"] = fmt.Sprint(roundFloat(outPutArray[i].Size, 2))
		//Атрибут путь формируется из переданного функции путя к директории и названия папки
		term["path"] = fmt.Sprintf("%s/%s", rootPath, string(outPutArray[i].Name))

		//Временная мапа добавляется в массив
		mapOfDirs[i] = term
	}

	response := make(map[string]interface{})

	//Формирование ответа
	response["status"] = "1"
	response["error"] = "None"
	response["dirs"] = mapOfDirs
	response["pathDirs"] = strings.Split(rootPath, "/")[1:]

	//Перевод ответа в json формат
	responseInJSON, _ := json.Marshal(response)
	fmt.Printf("%s\n", responseInJSON)
	return fmt.Sprintf("%s\n", responseInJSON)
}

// Вывод в формате JSON при ошибке
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
	ROOT := queries["ROOT"][0]
	limit, _ := strconv.ParseFloat(queries["limit"][0], 32)
	sortType := strings.ToLower(queries["sort"][0])

	//Ответ на запрос
	var response string = ""

	//Проверка верности указанных параметров
	err := validation(ROOT, limit, sortType)
	if err != nil {
		response = errOutPut(err)
		fmt.Println(err)
	} else {

		//Создаём срез, в котором будут храниться имена и размеры всех папок, находящихся в указанной директории
		nameSizeArray, err := dirsizecalc.GetDirectories(ROOT)
		if err != nil {
			response = errOutPut(err)
		}

		//Выводим результат
		response = output(nameSizeArray, ROOT, limit, sortType)
	}

	//Загрузка в хедер ответа параметров, без которых некоторые браузеры не примут ответ
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.WriteHeader(http.StatusOK)

	//Вывод ответа
	w.Write([]byte(response))
}

func main() {
	//Создаём роутер и добавляем его параметры
	r := mux.NewRouter()
	r.Path("/dirsize").
		Queries("ROOT", "{ROOT}").
		Queries("limit", "{limit}").
		Queries("sort", "{sort}").
		HandlerFunc(startCalculation).
		Methods("GET", "OPTIONS")

	//Регистрируем хендлер
	http.Handle("/", r)

	//Считываем конфиг
	file, err := os.Open("/home/ivan/Desktop/githubProjects/servermaking/servermaking/server.config")
	if err != nil {
		fmt.Println("Ошибка при открытие конфига", err)
	}
	defer file.Close()

	//Хранилище данных конфига в формате "атрибут":"значение"
	config := make(map[string]string)

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		tempName, tempValue := configStringParse(scanner.Text())
		config[tempName] = tempValue
	}
	if err := scanner.Err(); err != nil {
		fmt.Println("Ошибка при чтении конфига", err)
	}
	//

	//Запускаем сервер
	log.Println("Listening...")
	http.ListenAndServe(":"+config["port"], nil)
}
