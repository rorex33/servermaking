package main

import (
	"database/sql"
	"fmt"

	_ "github.com/go-sql-driver/mysql"
)

type Tag struct {
	ID int `json:"id"`
}

func main() {
	//
	db, err := sql.Open("mysql", "user:Password.1@tcp(127.0.0.1:3306)/STATS_DB")
	if err != nil {
		panic(err.Error())
	}
	defer db.Close()

	//
	insert, err := db.Query("INSERT INTO test VALUES ( 2, 'TEST' )")
	if err != nil {
		panic(err.Error())
	}
	defer insert.Close()

	//
	results, err := db.Query("SELECT id FROM t_stat")
	defer results.Close()

	for results.Next() {
		var tag Tag
		err = results.Scan(&tag.ID)
		if err != nil {
			panic(err.Error())
		}
		fmt.Println(tag.ID)
	}
}
