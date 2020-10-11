/*  CSE 154 Homework 6: Bestreads
    Anastasia Erofeeva
    05/18/2017
    Section: AH
    TA: Melissa Medsker
    This is a JavaScript file for the "Bestreads" assignment. */

// Module pattern and use strict.    
(function () {
    "use strict";
    
    // Aliases for common DOM functions.
    var $ = function(id) { return document.getElementById(id); };
    var qs = function(sel) { return document.querySelector(sel); };
    var qsa = function(sel) { return document.querySelectorAll(sel); }; 
    
    // Calls the requestBooks function to get the information for the books from
    // the server. Calls the clickHome function when the "Home" button is clicked.
    window.onload = function() {
        requestBooks("books");
        $("back").onclick = clickHome;
    };
    
    // Gets the titles and folder names of all the books from the server.
    // Calls the addBooks function to add books to the page.
    function requestBooks(mode) {
        var booksPromise = promise("bestreads.php?mode=" + mode);
        booksPromise
            .then(JSON.parse)
            .then(addBooks)
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
    }
    
    // Takes a request url and and makes a request to the server.
    // Returns data based on the url parameter.
    function promise(url, params) {
        return new AjaxGetPromise(url);
    }
    
    // Takes the JSON data returned from the server and uses it to add books
    // to the page, with their cover image and title. Calls the clickBook
    // function when a book is clicked.
    function addBooks(result) {
        var booksArray = result["books"];
        for (var i = 0; i < booksArray.length; i++) {
            var booksDiv = document.createElement("div");
            var cover = document.createElement("img");
            var title = document.createElement("p");
            var folder = booksArray[i]["folder"];
            booksDiv.classList.add("book-container");
            booksDiv.setAttribute("id", folder);
            cover.src = "books/" + folder + "/cover.jpg";
            cover.alt = folder;
            title.innerHTML = booksArray[i]["title"];
            booksDiv.appendChild(cover);
            booksDiv.appendChild(title);
            $("allbooks").appendChild(booksDiv);
        }
        $("singlebook").classList.add("hidden");
        var books = qsa(".book-container");
        for (var i = 0; i < books.length; i++) {
            books[i].onclick = clickBook;
        }
    }
    
    // Clears the books from the page and repeats the request to the server
    // to repopulate the page with the books when the "Home" button is clicked.
    function clickHome() {
        clearAllBooks();
        requestBooks("books");
        $("reviews").innerHTML = "";
    }
    
    // Changes the page from "all books" view to "single book" view.
    // Makes three requests to the server to get information about the books 
    // (info, description, and reviews). Calls other functions to add this
    // information to the page.
    function clickBook() {
        clearAllBooks();
        $("singlebook").classList.remove("hidden");
        $("cover").src = "books/" + this.id + "/cover.jpg";
        // Gets the info of the book based on its title.
        var infoPromise = promise("bestreads.php?mode=info&title=" + this.id);
        infoPromise
            .then(JSON.parse)
            .then(addBookInfo)
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
        // Gets the description of the book based on its title.    
        var descriptionPromise = promise("bestreads.php?mode=description&title=" + this.id);
        descriptionPromise
            .then(addBookDescription)
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
        // Gets the reviews of the book based on its title.
        var reviewsPromise = promise("bestreads.php?mode=reviews&title=" + this.id);
        reviewsPromise
            .then(JSON.parse)
            .then(addBookReviews)
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );        
    }
    
    // Takes the JSON data returned from the server and uses it to add the
    // title, author, and number of stars to the page, for the book that was clicked. 
    function addBookInfo(bookInfo) {
        $("title").innerHTML = bookInfo["title"];
        $("author").innerHTML = bookInfo["author"];
        $("stars").innerHTML = bookInfo["stars"];
    }
    
    // Takes the plain text data returned from the server and uses it to add the
    // description of the book that was clicked to the page.
    function addBookDescription(bookDescription) {
        $("description").innerText = bookDescription;
    }
    
    // Takes the JSON data returned from the server and adds to the page the book
    // reviews, as well as the authors of the reviews, and the stars awarded by
    // each review author.
    function addBookReviews(bookReviews) {
        for (var i = 0; i < bookReviews.length; i++) {
            var reviewTitle = document.createElement("h3");
            var score = document.createElement("span");
            var reviews = document.createElement("p");
            reviewTitle.innerHTML = bookReviews[i]["name"] + " ";
            score.innerHTML = bookReviews[i]["score"];
            reviews.innerHTML = bookReviews[i]["text"];
            reviewTitle.appendChild(score);
            $("reviews").appendChild(reviewTitle);
            $("reviews").appendChild(reviews);
        }
    }
    
    // Helper function that removes all of the books from the "all books" view
    // of the page.
    function clearAllBooks() {
        $("allbooks").innerHTML = "";
    }
    
})();