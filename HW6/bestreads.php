<?php
/*  CSE 154 Homework 6: Bestreads
    Anastasia Erofeeva
    05/18/2017
    Section: AH
    TA: Melissa Medsker
    This is a PHP file for the "Bestreads" assignment. */
    
    // Gets the "mode" query parameter from the url and stores it as a variable.
    $mode = $_GET["mode"];

    // If the mode is "description", gets the data from the descritption.txt
    // file of the book specified by the "title" query parameter, and prints
    // the description as plain text.
    if ($mode == "description") {
        header("Content-Type: text/plain");
        print(file_get_contents("books/" . $_GET["title"] . "/description.txt"));
        
    // If the mode is "info", gets the data from the info.txt file of the book
    // that is specified by the "title" query parameter, and prints the info
    // of the book (title, author, stars) as a JSON array.
    } else if ($mode == "info") {
        $info = file("books/" . $_GET["title"] . "/info.txt", 
            FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        $data = [
            "title" => $info[0], 
            "author" => $info[1], 
            "stars" => $info[2]
        ];
        print(json_encode($data));
    
    // If the mode is "reviews", gets the data from each of the review.txt files
    // of the book that is specified by the "title" query parameter, and prints
    // the reviews (name, score, text) as a JSON array.
    } else if ($mode == "reviews") {
        $regexPattern = "/(books\/.*\/)(review.*\.txt)/";
        $files = glob("books/" . $_GET["title"] . "/*.txt");
        $result = [];
        foreach ($files as $file) {
            if (preg_match($regexPattern, $file)) {
                $reviewContents = file($file);
                $result[] = [
                    "name" => trim($reviewContents[0]),
                    "score" => trim($reviewContents[1]),
                    "text" => trim($reviewContents[2]),
                ];
            }
        }
        print(json_encode($result));
    
    // Finally, if the mode is "books", gets titles of all of the books from their
    // info.txt files, as well as the folder names of all of the books. Prints the
    // data as JSON.
    } else if ($mode == "books") {
        $books = glob("books/*/*.txt");
        $result = [];
        foreach ($books as $book) {
            if (preg_match("/(info.txt)/", $book)) {
                $fileContents = file($book);
                $data[] = [
                    "title" => trim($fileContents[0]),
                    "folder" => substr(dirname($book), strlen("books/")),
                ];
            }
        }
        $result = [
            "books" => $data,
        ];
        print(json_encode($result));
    }
?>