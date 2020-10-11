<?php
/*  CSE 154 Homework 7: Pokedex 2
    Anastasia Erofeeva
    05/23/2017
    Section: AH
    TA: Melissa Medsker
    This is a PHP file for the "Pokedex 2" assignment, 
    that fetches all the found Pokemon from the Pokedex. */
    
    include 'common.php';
    $rows = $db->query("SELECT * FROM Pokedex");
    $result = [];
    foreach ($rows as $row) {
        $data[] = [
            "name" => $row["name"], 
            "nickname" => $row["nickname"], 
            "datefound" => $row["datefound"]
        ];
    }
    $result = [
        "pokemon" => $data,
    ];
    print(json_encode($result));
?>