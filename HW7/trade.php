<?php
/*  CSE 154 Homework 7: Pokedex 2
    Anastasia Erofeeva
    05/23/2017
    Section: AH
    TA: Melissa Medsker
    This is a PHP file for the "Pokedex 2" assignment, 
    that updates the Pokedex after a Pokemon trade. */
    
    include 'common.php';
    setHeader("application/json");
    errorMessages(array("mypokemon", "theirpokemon"), 2);
    
    $mypokemon = $_POST["mypokemon"];
    $theirpokemon = $_POST["theirpokemon"];
    $nickname = strtoupper($_POST["theirpokemon"]);

    $myCount = countPokemon($mypokemon, $db);
    $theirCount = countPokemon($theirpokemon, $db);
    
    if ($myCount == 0) {
        print(json_encode(['error' => "Error: Pokemon $mypokemon not found in your Pokedex."]));
    } else if ($theirCount != 0) {
        print(json_encode(['error' => "Error: You have already found $theirpokemon."]));
    } else {
        $db->exec("DELETE FROM Pokedex WHERE (name='$mypokemon')");
        $db->exec("INSERT INTO Pokedex (name, nickname, datefound) 
            VALUES ('$theirpokemon', '$nickname', '$time')");
        print(json_encode(
            ['success' => "Success! You have traded your $mypokemon for $theirpokemon!"]));
    }
?>