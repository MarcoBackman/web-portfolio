//if in dark mode
'use strict';

function changeButtonColor(trigger) {
    const btn_list = document.querySelectorAll(".learn_btn");
    if (trigger) {
        console.log("trigger");
        btn_list.forEach(btn => {
            console.log("Color change");
            btn.style.background = "#6b6b6b";
            btn.style.color = "#6b6b6b";
            btn.style.borderColor = "#6b6b6b";
        });
    } else {
        btn_list.forEach(btn => {
            console.log("Color change");
            btn.style.background = "#c0ded7";
            btn.style.color = "#b9936c";
            btn.style.borderColor = "#b9936c";
        });
    }
}

document.addEventListener("DOMContentLoaded", async() => {
    let dark_mode_btn = document.querySelector("#darkmode");
    let trigger = dark_mode_btn.checked;
    await dark_mode_btn.addEventListener('change', changeButtonColor(trigger));
    changeButtonColor(trigger);
});


//if checkbox triggered