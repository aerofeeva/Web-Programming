<?php
/*  CSE 154 Homework 7: Pokedex 2
    Anastasia Erofeeva
    05/23/2017
    Section: AH
    TA: Melissa Medsker
    This is a PHP file for the "Pokedex 2" assignment, 
    that gives a new nickname to a Pokemon in the Pokedex. */
    
    include 'common.php';
    setHeader("application/json");
    errorMessages(array("name", "nickname"), 2);
    
    $nickname = $_POST["nickname"];
    $update = $db->prepare("UPDATE Pokedex SET nickname = '$nickname' WHERE name = '$name'");
    $update->execute();
    $count = $update->rowCount();
    if ($count == 0) {
        print(json_encode(['error' => "Error: Pokemon $originalName not found in your Pokedex."]));
    } else {
        print(json_encode(['success' => "Success! Your $name is now named $nickname!"]));
    }
?>