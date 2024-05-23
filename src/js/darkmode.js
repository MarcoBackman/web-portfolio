//check for value on page load, read property setting from local storage

let darkMode = window.localStorage.getItem("dark-mode") === "true";
window.onload = init;

function setDarkModeTrigger(darkMode) {
    let darkModeHtml = document.getElementById("dark-mode");
    darkModeHtml.checked = darkMode === true;
}

//Execute this after DOM page is fully loaded
function init() {
    if (darkMode) {
        setDarkModeTrigger(true);
    }
}

//new wrapper function
const updateDarkMode = () => {
    darkMode = !darkMode; //invert our variable
    window.localStorage.setItem("dark-mode", darkMode); //save it in local storage
}