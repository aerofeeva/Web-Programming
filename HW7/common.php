<?php
/*  CSE 154 Homework 7: Pokedex 2
    Anastasia Erofeeva
    05/23/2017
    Section: AH
    TA: Melissa Medsker
    This is a PHP file for the "Pokedex 2" assignment, 
    with shared PHP functions for the other PHP files. */
    
    error_reporting(E_ALL);
    $db = new PDO("mysql:dbname=hw7;host=localhost;charset=utf8", "root", "");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Sets the time for the "datefound" column in the Pokedex table.
    date_default_timezone_set('America/Los_Angeles');
    $time = date('y-m-d H:i:s');
    
    // Takes a type (plain text or json) and sets the header. 
    function setHeader($type) {
        header("Content-Type: $type");
    }
    
    // Takes a pokemon name and a database name and counts how many times (0 or 1)
    // the given pokemon appears in the given database.
    function countPokemon($pokemon, $database) {
        $sql = "SELECT count(*) FROM Pokedex WHERE (name='$pokemon')"; 
        $result = $database->prepare($sql); 
        $result->execute(); 
        $count = $result->fetchColumn(); 
        return $count;
    }
    
    // Takes 1 or more parameters and the number of required parameters
    // and prints error messages if the required parameter or parameters
    // are not provided. 
    function errorMessages($parameters, $numRequired) {
        if (count($parameters) == 1) {
            if (!isset($_POST[$parameters[0]])) {
                header("HTTP/1.1 400 bad request");
                die(json_encode(['error' => "Missing " . $parameters[0] . " parameter"]));
            }
        } else if (count($parameters) == 2 && $numRequired == 2) {
            if ((!isset($_POST[$parameters[0]])) && (!isset($_POST[$parameters[1]]))) {
                header("HTTP/1.1 400 bad request");
                die(json_encode(
                    ['error' => "Missing " . $parameters[0] . " and " . $parameters[1] . " parameters"]));
            }
        } else {
            if ((!isset($_POST[$parameters[0]])) && (!isset($_POST[$parameters[1]]))) {
                header("HTTP/1.1 400 bad request");
                die(json_encode(
                    ['error' => "Missing " . $parameters[0] . " or " . $parameters[1] . " parameters"]));
            }
        }
    }
?>