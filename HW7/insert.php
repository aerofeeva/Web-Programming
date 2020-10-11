<?php
/*  CSE 154 Homework 7: Pokedex 2
    Anastasia Erofeeva
    05/23/2017
    Section: AH
    TA: Melissa Medsker
    This is a PHP file for the "Pokedex 2" assignment, 
    that adds a Pokemon to the Pokedex. */
    
    include 'common.php';
    setHeader("application/json");
    errorMessages(array("name"), 1);
    
    $nickname = "";
    if (!isset($_POST["nickname"])) {
        $nickname = strtoupper($_POST["name"]);
    } else {
        $nickname = $_POST["nickname"];
    }
    
    $name = $_POST["name"];
    
    try {
        $db->exec("INSERT INTO Pokedex (name, nickname, datefound) 
            VALUES ('$name', '$nickname', '$time')");
        print(json_encode(['success' => "Success! $name added to your Pokedex!"]));
    } catch (PDOException $pdoex) {
       if ($pdoex->errorInfo[1] == 1062) {
           print(json_encode(['error' => "Error: Pokemon $name already found."]));
       }
    }
?>