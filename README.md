# GIF-Generator
UMN Coding Bootcamp - AJAX Homework

## Goal
* View GIFs on any device with the click of a button.  Also, add additional search buttons with free text.

## Global variables
* const HOST - Store protocal and host name (https://api.giphy.com)
* const SEARCHPATH - Store path to search API (/v1/gifs/search)
* const GIPHYAPIKEY - The API key for the developer's GIPHY account
* let queryString - Dynamic variable to store the query String
* let buttonText - Array of strings containing the text of the buttons to search

## Input Events
* Clicking the button to add a new search button (with text in the adjacent box)
    * Effect: Add a new button to the group of search buttons
* Clicking on a search button 
    * Effect: Clear current GIFs and put newly requested GIFs in based on the button
* Clicking on a particular GIF
    * Effect: pause moving image or start still image

## Display
### Basic structure:
* Header
* Main
    * Additional options div
        * Add new search button div
            * Button
            * Text box
    * Group of search buttons flex container div
    * GIFs returned by search flex container div

## Technical Details
* Use the fixed_height and fixed_height_still images from GIPHY for tablets and desktop size
* Use the fixed_height_small and fixed_height_small_still from GIPHY for mobile phone size
