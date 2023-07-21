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

func configparse(val string) (string, string) {
	i := 0
	for val[i] != ' ' {
		i++
	}
	name := val[0:i]
	for val[i] == ' ' || val[i] == '=' {
		i++
	}
	fl := i
	value := val[fl:]
	return name, value
}

// Приведение вещественного числа к виду с заданным количеством чисел после запятой.
func roundFloat(val float64, precision uint) float64 {
	ratio := math.Pow(10, float64(precision))
	return math.Round(val*ratio) / ratio
}

// Проверка верности входных параметров.
func validation(rootPath string, limit float64, sortType string) error {
	if _, err := os.Stat(rootPath); os.IsNotExist(err) {
		err := errors.New("validation fail: wrong root path " + rootPath)
		return err
	}

	if limit < 0 {
		err := errors.New("validation fail: wrong limit")
		return err
	}

	if sortType != "asc" && sortType != "desc" {
		err := errors.New("validation fail: wrong sort")
		return err
	}

	return nil

}

// Сортировка и вывод в формате JSON
func output(outPutArray []dirsizecalc.NameSize, rootPath string, limit float64, sortType string) string {
	if sortType == "asc" {
		sort.Sort(BySizeASC(outPutArray))
	} else {
		sort.Sort(BySizeDESC(outPutArray))
	}

	x := make([]map[string]string, len(outPutArray))
	for i := range outPutArray {
		term := make(map[string]string)
		term["path"] = fmt.Sprintf("%s/%s", rootPath, string(outPutArray[i].Name))
		term["size"] = fmt.Sprint(roundFloat(outPutArray[i].Size, 2))
		term["name"] = outPutArray[i].Name
		x[i] = term
	}

	m := make(map[string]interface{})

	m["status"] = "1"
	m["error"] = "None"
	m["dirs"] = x
	m["pathDirs"] = strings.Split(rootPath, "/")[1:]

	m_res, _ := json.Marshal(m)
	fmt.Printf("%s\n", m_res)
	return fmt.Sprintf("%s\n", m_res)
}

// Вывод в формате JSON при ошибке
func errOutPut(err error) string {
	m := make(map[string]interface{})

	m["status"] = "0"
	m["error"] = fmt.Sprint(err)
	m["dirs"] = "Something gone wrong"

	m_res, _ := json.Marshal(m)
	fmt.Printf("%s\n", m_res)
	return fmt.Sprintf("%s\n", m_res)
}

// Хендлер-функция для нашего запроса. Парсит параметры, запускает их валидацию, вычисления размеров директорий и вывод результата.
func startCalculation(w http.ResponseWriter, r *http.Request) {
	//Парсинг параметров
	queries := r.URL.Query()
	ROOT := queries["ROOT"][0]
	limit, _ := strconv.ParseFloat(queries["limit"][0], 32)
	sortType := strings.ToLower(queries["sort"][0])

	var result string = ""

	//Проверка верности указанных параметров
	err := validation(ROOT, limit, sortType)
	if err != nil {
		result = errOutPut(err)
		fmt.Println(err)
	} else {

		//Создаём срез, в котором будут храниться имена и размеры всех папок, находящихся в указанной директории
		nameSizeArray, err := dirsizecalc.GetDirectories(ROOT)
		if err != nil {
			result = errOutPut(err)
		}

		//Выводим результат
		result = output(nameSizeArray, ROOT, limit, sortType)
	}
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(result))
	//json.NewEncoder(w).Encode(result)

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

	//Запускаем сервер
	//Считываем конфиг
	file, err := os.Open("/home/ivan/Desktop/githubProjects/servermaking/servermaking/server.config")
	if err != nil {
		fmt.Println("wrong file")
	}
	defer file.Close()

	config := make(map[string]string)

	scanner := bufio.NewScanner(file)
	for scanner.Scan() {
		tempName, tempValue := configparse(scanner.Text())
		config[tempName] = tempValue
	}
	if err := scanner.Err(); err != nil {
		log.Fatal(err)
	}
	//
	log.Println("Listening...")
	http.ListenAndServe(":"+config["port"], nil)
}
