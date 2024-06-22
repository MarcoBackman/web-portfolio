document.addEventListener('DOMContentLoaded', function() {
    var navButtons = document.querySelectorAll('.nav-button');

    navButtons.forEach(function(button) {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // prevent the navigation

            // delay the navigation by 800ms
            setTimeout(function () {
                window.location.href = event.target.getAttribute('href');
            }, 350);
        });
    });
});