/*  CSE 154 Homework 3: Speedreader
    Anastasia Erofeeva
    04/21/2017
    Section: AH
    TA: Melissa Medsker
    This is a JavaScript file for speed reading website */

// Module pattern and use strict.    
(function () {
    "use strict";
    
    // Function to reduce typing for 'document.getElementById'.
    var $ = function(id) {
        return document.getElementById(id);
    };
    
    // Default delay for the timer. Specified as a constant to avoid magic numbers. 
    var DEFAULT_DELAY = 171;
    
    // Global variables for the timer, the list of frames, the current frame, and the timer delay.
    var timer = null;
    var frames = null;
    var index = 0;
    var delay = DEFAULT_DELAY;
    
    // Function that calls another function to start the timer when the 'start' button is clicked.
    window.onload = function() {
        $("start").onclick = startTimer; 
        
        // Function to start the timer. 
        function startTimer() {
            timer = setInterval(animation, delay);
        }
        
        // Calls a function to stop the animation when the 'stop' button is clicked.
        $("stop").onclick = stopAnimation;
        
        // Calls a function to change the size of the text when the one of the radio buttons 
        // is clicked.
        var sizeChoices = document.getElementsByName("size");
        for (var i = 0; i < sizeChoices.length; i++) {
            sizeChoices[i].onclick = changeSize;
        }
        
        // Calls a function to change the speed of the animation when one of the speeds
        // is selected from the list. 
        $("speed").onchange = changeSpeed;
    };
    
    // Function to display the text from the input area in the 'reading area' one word
    // at a time. Also removes the punctuation at the end of the words (but only the last
    // character). Disables the 'start' button and the text input area. Enables the 'stop'
    // button. 
    function animation() {
        $("start").disabled = true;
        $("stop").disabled = false;
        document.querySelector("textarea").disabled = true;
        var input = document.querySelector("textarea").value;
        frames = input.split(/[ \t\n]+/);
        var punctuation = [".", ",", ":", ";", "?", "!"];
        for (var i = 0; i < frames.length; i++) {
            var last = frames[i].slice(-1);
            for (var j = 0; j < punctuation.length; j++) {
                if (last == punctuation[j]) {
                    frames[i] = frames[i].slice(0, -1);
                    frames.splice(i, 0, frames[i]);
                    i++;
                }
            }
        }
        if (index < frames.length) {
            $("readarea").innerHTML = frames[index];
            index++;
        } else {
            stopAnimation();
        }
    }
    
    // Function to stop the animation. Clears the text from the 'reading area'. 
    // Disables the 'stop' button. Enables the 'start button and the text input area. 
    function stopAnimation() {
        $("start").disabled = false;
        $("stop").disabled = true;
        document.querySelector("textarea").disabled = false;
        clearInterval(timer);
        timer=null;
        $("readarea").innerHTML = "";
        index = 0;
    }
    
    // Fucntion to change the size of the text during the animation.
    function changeSize() {
        if (this.value == "medium") {
            $("readarea").style.fontSize = "36pt";
        } else if (this.value == "big") {
            $("readarea").style.fontSize = "48pt";
        } else {
            $("readarea").style.fontSize = "60pt";
        }
    }
    
    // Function to change the speed of the text during the animation.
    function changeSpeed() {
        delay = this.value;
        if (timer) {
            clearInterval(timer);
            timer = setInterval(animation, delay);
        }
    }
})();