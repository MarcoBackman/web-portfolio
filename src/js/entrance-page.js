let spinner = document.querySelector("#svg-spinner");


//Loading screen
let loadingScreen = document.getElementById('loading-screen');

function languageSelected() {
    loadingScreen.style.display = 'block';
    console.log("click!");
    if(this.value === '한국어') {
        setTimeout(function(){
            window.location.replace('/html/mainPages/homepage-kr.html');
        }, 1500);
    } else if (this.value === 'English') {
        setTimeout(function(){
            window.location.replace('/html/mainPages/homepage.html');
        }, 1500);
    }
}

document.querySelectorAll('.language-card')
    .forEach(function(element) {
    element.addEventListener('click', languageSelected);
});
