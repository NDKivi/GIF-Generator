//=============================================================================
// Global variables
//=============================================================================
const GIPHYHOST = "https://api.giphy.com";
const SEARCHPATH = "/v1/gifs/search";
const GIPHYAPIKEY = ""; //must replace with actual key!!!!!!!!
const OTHERPARAMS = "&limit=10&offset=0&rating=G&lang=en";

let queryString;
let buttonValues; // Array of strings
let responseData; // Array of objects

// Array of booleans (true for images that move; false for images that don't)
let isMovingImage;
// Boolean (true: display small images.  false: display large images)
let imagesAreSmall;
//Boolean (true: display fixed width images. false: display fixed height)
let imagesFixedWidth;
//Boolean (true: newly generated sets of images start out moving.  false:
//           newly generated images start still)
let imagesMovingByDefault;

//=============================================================================
// Input
//=============================================================================
$(document).ready(function () {

    /* Start initialization */
    initializeButtonValues();
    displaySearchButtons();
    responseData = [];
    isMovingImage = [];
    imagesAreSmall = false;
    imagesFixedWidth = false;
    imagesMovingByDefault = false;
    /* End initialization */

    $("#search-buttons").on("click", ".search", function () {
        let queryURL = GIPHYHOST + SEARCHPATH + "?api_key=" + GIPHYAPIKEY
            + "&q=" + $(this).text() + OTHERPARAMS;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function (response) {
            let tempArr = response.data.map(function () {
                return imagesMovingByDefault;
            });
            isMovingImage = isMovingImage.concat(tempArr);
            responseData = responseData.concat(response.data);
            removeDuplicates();
            displayGIFs();
        });

    });

    $("#results").on("click", ".image", function () {
        let index = parseInt($(this).attr("id"));
        if (isMovingImage[index]) {
            isMovingImage[index] = false;
        } else {
            isMovingImage[index] = true;
        }
        $(this).attr("src", getSourceURL(index));
    });

    $("#search-box").keypress(function (e) {
        if (e.which === 13) {
            let buttonText = $("#search-box").val();
            if (buttonText !== "" && buttonText.length > 2) {
                $("#search-box").val("");
                buttonText = buttonText.charAt(0).toUpperCase() + buttonText.slice(1);
                $("#search-buttons").append(`<div><button class='search'>${buttonText}</button></div>`);
            }
        }
    });

    $("#even-rows").on("click", function () {
        if (imagesFixedWidth) {
            $(this).addClass("button-depressed");
            $("#even-columns").removeClass("button-depressed");
            imagesFixedWidth = false;
            displayGIFs();
        }
    });

    $("#even-columns").on("click", function () {
        if (!imagesFixedWidth) {
            $(this).addClass("button-depressed");
            $("#even-rows").removeClass("button-depressed");
            imagesFixedWidth = true;
            displayGIFs();
        }
    });

    $("#clear-images").on("click", function () {
        responseData = [];
        isMovingImage = [];
        displayGIFs();
    });

    $("#reset-search-buttons").on("click", function () {
        initializeButtonValues();
        displaySearchButtons();
    });

    $("#still-by-default").on("click", function () {
        if (imagesMovingByDefault) {
            $(this).addClass("button-depressed");
            $("#moving-by-default").removeClass("button-depressed");
            imagesMovingByDefault = false;
        }
    });

    $("#moving-by-default").on("click", function () {
        if (!imagesMovingByDefault) {
            $(this).addClass("button-depressed");
            $("#still-by-default").removeClass("button-depressed");
            imagesMovingByDefault = true;
        }
    });

});



//=============================================================================
// Main logic
//=============================================================================

function initializeButtonValues() {
    buttonValues = ["Happy", "Sad", "Surprise", "Angry", "Excited"];
}

function getSourceURL(index) {

    if (isMovingImage[index]) {
        if (imagesAreSmall) {
            if (imagesFixedWidth) {
                return responseData[index].images.fixed_width_small.url;
            } else {
                return responseData[index].images.fixed_height_small.url;
            }
        } else {
            if (imagesFixedWidth) {
                return responseData[index].images.fixed_width.url;
            } else {
                return responseData[index].images.fixed_height.url;
            }
        }
    } else {
        if (imagesAreSmall) {
            if (imagesFixedWidth) {
                return responseData[index].images.fixed_width_small_still.url;
            } else {
                return responseData[index].images.fixed_height_small_still.url;
            }
        } else {
            if (imagesFixedWidth) {
                return responseData[index].images.fixed_width_still.url;
            } else {
                return responseData[index].images.fixed_height_still.url;
            }
        }
    }
}

function getTitle(index) {
    let title = responseData[index].title;
    title = title.replace(/gif/gi,"");
    let temp = title.indexOf("by");
    if (temp > 3) {
        title = title.substring(0, temp);
    }

    let stringIndex;
    title = title.toLowerCase();
    let titleArray = title.split(" ");
    for (let stringIndex = 0; stringIndex < titleArray.length; stringIndex++) {
        titleArray[stringIndex] = titleArray[stringIndex].charAt(0).toUpperCase() + titleArray[stringIndex].slice(1);
    }
    title = titleArray.join(" ");
    return title;
}

function removeDuplicates() {
    let tempArray = [];
    let hashTable = {};
    let tempArrayIndex = 0;
    for (let i = 0; i < responseData.length; i++) {
        let uniqueID = responseData[i].id;
        if (hashTable[uniqueID] !== 1) {
            hashTable[uniqueID] = 1;
            tempArray[tempArrayIndex] = responseData[i];
            tempArrayIndex++;
        }
    }
    responseData = tempArray;
}


//=============================================================================
// Display functions
//=============================================================================

function displaySearchButtons() {
    $("#search-buttons").empty();
    for (let buttonValue of buttonValues) {
        $("#search-buttons").append(`<div><button class='search'>${buttonValue}</button></div>`);
    }
}

function displayGIFs() {
    $("#results").empty();
    if ($(window).width() <= 640) {
        imagesAreSmall = true;
    } else {
        imagesAreSmall = false;
    }
    for (let index in responseData) {
        let srcURL = getSourceURL(index);
        let title = getTitle(index);
        $("#results").prepend(`<div class='image-card'><img src='${srcURL}' class='image' id='${index}'><p>${title}</p></div>`);
    }
}