<?php
/*  CSE 154 Homework 7: Pokedex 2
    Anastasia Erofeeva
    05/23/2017
    Section: AH
    TA: Melissa Medsker
    This is a PHP file for the "Pokedex 2" assignment, 
    that removes a Pokemon from the Pokedex. */
    
    include 'common.php';
    setHeader("application/json");
    errorMessages(array("name", "mode"), 1);
    
    if (isset($_POST["name"])) {
        $originalName = $_POST["name"];
        $name = ucfirst(strtolower($originalName));
        $count = countPokemon($name, $db);
        if ($count == 0) {
            print(json_encode(
                ['error' => "Error: Pokemon $originalName not found in your Pokedex."]));
        } else {
            $db->exec("DELETE FROM Pokedex WHERE (name='$name')");
            print(json_encode(['success' => "Success! $name removed from your Pokedex!"]));
        }
    } else if (isset($_POST["mode"]) && $_POST["mode"] == "removeall") {
        $db->exec("DELETE FROM Pokedex");
        print(json_encode(['success' => "Success! All Pokemon removed from your Pokedex!"]));
    } else {
        $mode = $_POST["mode"];
        print(json_encode(['error' => "Error: Unknown mode $mode."]));
    }
?>