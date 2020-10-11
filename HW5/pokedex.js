/*  CSE 154 Homework 5: Pokedex
    Anastasia Erofeeva
    05/07/2017
    Section: AH
    TA: Melissa Medsker
    This is a JavaScript file for the "Pokedex" assignment. */

// Module pattern and use strict.    
(function () {
    "use strict";
    
    // Aliases for common DOM functions.
    var $ = function(id) { return document.getElementById(id); };
    var qs = function(sel) { return document.querySelector(sel); };
    var qsa = function(sel) { return document.querySelectorAll(sel); }; 
    
    // Global variable for the found Pokemon.
    var found = [];
    
    // Global variable for the game ID.
    var guid = "";
    
    // Global variable for the player ID.
    var pid = "";
    
    // Constant for the max width of the health bar. 
    var MAX_WIDTH = 100;
    
    // Calls the fetchSprites function to get the sprites data. Calls functions 
    // when buttons are clicked. 
    window.onload = function() {
        fetchSprites();
        $("start-btn").onclick = startGame;
        var buttons = qs(".moves").getElementsByTagName("button");
        for (var i = 0; i < buttons.length; i++) {
            buttons[i].onclick = clickMove;
        }
        $("flee-btn").onclick = fleeGame;
        $("endgame").onclick = endGame;
    };
    
    // Gets the names and images of sprites and calls the appendSprites
    // function to add the sprites to the page.
    function fetchSprites() {
        var spritesPromise = promise("get", 
            "https://webster.cs.washington.edu/pokedex/pokedex.php?pokedex=all");
        spritesPromise
            .then(appendSprites)
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
    }
    
    // Takes a request type (get or post), a request url, and any request parameters.
    // Makes a request based on the parameters and returns data (JSON or plain text).
    function promise(type, url, params) {
        if (type == "get") {
            return new AjaxGetPromise(url);
        } else {
            return new AjaxPostPromise(url, params);
        }
    }
    
    // Takes the plain text data returned from the server after the get request, and
    // uses it to add sprites to the page. Calls the addFound function to mark the sprites 
    // of the three starter Pokemon (Bulbasaur, Charmander, and Squirtle) as found, and 
    // make them clickable. 
    function appendSprites(spritesArray) {
        spritesArray = spritesArray.split("\n");
        for (var i = 0; i < spritesArray.length; i++) {
            var img = document.createElement("img");
            img.classList.add("sprite");
            img.classList.add("unfound");
            var index = spritesArray[i].indexOf(":");
            img.src = "sprites/" + spritesArray[i].slice(index + 1);
            var name = spritesArray[i].slice(0, index);
            img.alt = name;
            img.setAttribute("id", name);
            if (img.id == "Bulbasaur" || img.id == "Charmander" || img.id == "Squirtle") {
                addFound(img);
            }
            $("pokedex-view").appendChild(img);
        }
    }
    
    // Takes a Pokemon that has been found and adds it to the list of found Pokemon.
    // Also makes the sprite of the Pokemon clickable.
    function addFound(sprite) {
        found.push(sprite.id);
        sprite.classList.remove("unfound");
        sprite.onclick = clickSprite;
    }
    
    // Gets data from the server when a found sprite is clicked.
    // Uses the data to populate the card of player 1.
    function clickSprite() {
        var cardPromise = promise("get", 
            "https://webster.cs.washington.edu/pokedex/pokedex.php?pokemon=" + 
            this.id.toLowerCase());
        cardPromise
            .then(JSON.parse)
            .then(function(response) {
                populateCard(response, "#my-card");
                $("start-btn").classList.remove("hidden");
            })
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
    }
    
    // Takes the JSON data returned from the server and a card (player's card or
    // opponent's card), and populates the given card with the data returned from 
    // the server.
    function populateCard(cardInfo, card) {
        qs(card + " .name").innerText = cardInfo.name;
        qs(card + " .hp").innerText = cardInfo.hp + "HP";
        qs(card + " .info").innerText = cardInfo.info.description;
        qs(card + " .pokepic").src = cardInfo.images.photo;
        qs(card + " .type").src = cardInfo.images.typeIcon;
        qs(card + " .weakness").src = cardInfo.images.weaknessIcon;
        var movesArray = cardInfo.moves;
        for (var i = 0; i < movesArray.length; i++) {
            qs(card + " .moves").getElementsByTagName("button")[i].classList.remove("hidden");
            var moveButtons = qsa(card + " .move");
            moveButtons[i].innerText = cardInfo.moves[i].name;
            qs(card + " .moves").getElementsByTagName("img")[i].src = "icons/" + 
                cardInfo.moves[i].type + ".jpg";
            if (moveButtons.length > movesArray.length) {
                for (var j = movesArray.length; j < moveButtons.length; j++) {
                    qs(card + " .moves").getElementsByTagName("button")[j]
                        .classList.add("hidden");
                }
            }
        }
    }
    
    // Changes the page into "Pokemon Battle Mode" by hidding the pokedex view and
    // displaying the opponent's card. Makes a request to the server and uses the 
    // data returned to populate the opponent's card and update the guid/pid.
    function startGame() {
        $("pokedex-view").classList.add("hidden");
        $("their-card").classList.remove("hidden");
        $("start-btn").classList.add("hidden");
        $("flee-btn").classList.remove("hidden");
        $("results-container").classList.remove("hidden");
        $("p1-turn-results").innerText = "";
        $("title").innerHTML = "Pokemon Battle Mode!";
        qs(".hp-info").classList.remove("hidden");
        var postPromise = promise("post", "https://webster.cs.washington.edu/pokedex/game.php", {
            "startgame" : "true",
            "mypokemon" : qs("#my-card .name").innerText
        });
        postPromise
            .then(JSON.parse)
            .then(function(response) {
                guid = response.guid;
                pid = response.pid;
                response = response["p2"];
                populateCard(response, "#their-card");
            })
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
        setUpGame("#my-card");
        setUpGame("#their-card");
    }
    
    // Takes a card and restores the health bar of each player (in case a game has
    // already been played). Makes the area that will contain buffs/debuffs visible.
    function setUpGame(card) {
        qs(card + " .health-bar").style.width = MAX_WIDTH + "%";
        qs(card + " .health-bar").classList.remove("low-health");
        qs(card + " .buffs").classList.remove("hidden");
    }
    
    // Makes a request to the server and uses the data returned to call the playMove
    // function in order to play a move.
    function clickMove() {
        var postPromise = promise("post", "https://webster.cs.washington.edu/pokedex/game.php", {
            "guid" : guid,
            "pid" : pid,
            "movename" : this.innerText.toLowerCase().replace(/\s+/g, '')
        });
        postPromise
            .then($("loading").classList.remove("hidden"))
            .then(JSON.parse)
            .then(function(response) {
                playMove(response, "p1");
                playMove(response, "p2");
            })
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
    }
    
    // Uses the data returned from the server and a player (p1 or p2) to make a move
    // and display turn results on the page. Also updates the health bar and calls the 
    // applyBuffs function to add buffs/debuffs, if any are present.
    function playMove(moveData, player) {
        $("loading").classList.add("hidden");
        var card = "#my-card";
        if (player === "p2") {
            card = "#their-card";
        }
        $(player + "-turn-results").classList.remove("hidden");
        $(player + "-turn-results").innerText = "Player " + player.slice(-1) + " played " + 
            moveData.results[player + "-move"] + " and " + 
            moveData.results[player + "-result"] + "!";
        qs(card + " .buffs").innerHTML = "";
        qs(card + " .health-bar").style.width = 
            ((moveData[player]["current-hp"]) / (moveData[player]["hp"])) * MAX_WIDTH + "%";
        if (parseInt(qs(card + " .health-bar").style.width) < 20) {
            qs(card + " .health-bar").classList.add("low-health");
        } else {
            qs(card + " .health-bar").classList.remove("low-health");
        }
        qs(card + " .hp").innerText = moveData[player]["current-hp"] + "HP";
        // Calls the applyBuffs function.
        var buffs = ["buffs", "debuffs"];
        for (var i = 0; i < buffs.length; i++) {
            applyBuffs(moveData, player, buffs[i]);
        }
        if (moveData[player]["current-hp"] == 0) {
            $("endgame").classList.remove("hidden");
            if (player === "p1") {
                $("title").innerHTML = "You Lost!";
                if (moveData.results[player + "-move"] == "flee") {
                    $("p2-turn-results").classList.add("hidden");
                }
            } else {
                if (moveData.p1["current-hp"] != 0) {
                    $("title").innerHTML = "You Won!";
                    $("p2-turn-results").classList.add("hidden");
                    var newFound = $(moveData[player]["name"]);
                    if (!found.includes(newFound)) {
                        addFound(newFound);
                    }
                }
            }
        }
    }
    
    // Takes the data returned from the server, a player (p1 or p2), and a type
    // (buff or debuff) and uses this information to apply buffs or debuffs to 
    // the cards of either player.
    function applyBuffs(data, player, type) {
        if (data[player][type].length != 0) {
            for (var i = 0; i < data[player][type].length; i++) {
                var buff = document.createElement("div");
                buff.classList.add(data[player][type][i], type.slice(0, -1));
                var card = "#my-card";
                if (player == "p2") {
                    card = "#their-card";
                }
                qs(card + " .buffs").appendChild(buff);
            }
        }
    }
    
    // Makes a request to the server if the "Flee the Battle!" button is clicked
    // and uses the data returned to play the "flee" move for player 1. 
    function fleeGame() {
        var postPromise = promise("post", "https://webster.cs.washington.edu/pokedex/game.php", {
            "move": "flee",
            "guid" : guid,
            "pid" : pid
        });
        postPromise
            .then(JSON.parse)
            .then(function(response) {
                playMove(response, "p1");
            })
            .catch(function( errorMsg ) { alert( "ERROR: " + errorMsg ); } );
    }
    
    // Returns to the pokedex view when the "Back to Pokedex" button is clicked.
    // Hides and displays the necessary elements and clears the buffs/debuffs containers. 
    function endGame() {
        $("their-card").classList.add("hidden");
        $("results-container").classList.add("hidden");
        $("endgame").classList.add("hidden");
        $("pokedex-view").classList.remove("hidden");
        $("start-btn").classList.remove("hidden");
        $("flee-btn").classList.add("hidden");
        $("title").innerText = "Your Pokedex";
        qs("#my-card .buffs").innerHTML = "";
        qs("#their-card .buffs").innerHTML = "";
        qs("#my-card .hp-info").classList.add("hidden");
    }
})();