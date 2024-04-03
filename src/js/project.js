'use strict';

function getScrollY() {
    var top  = window.pageYOffset || document.documentElement.scrollTop
    return top;
}

function setComponentPosition(component) {
    let e = window.event;

    let posX = e.clientX;
    let posY = e.clientY;
    component.style.position = "absolute";
    //add scroll position of Y
    component.style.left = (posX + 10) + "px";
    component.style.top = (posY + getScrollY()) + "px";
}

let hover_target_components = document.querySelectorAll(".view_more_label");

hover_target_components.forEach(element => element.addEventListener('mouseover', function() {
    let detail_view_element = document.querySelector("#detail_view_box");
    detail_view_element.style.display = "flex";
    setComponentPosition(detail_view_element);
    return;
}));

hover_target_components.forEach(element => element.addEventListener('mouseout', function() {
    let detail_view_element = document.querySelector("#detail_view_box");
    detail_view_element.style.display = "none";
    return;
}));

function changeToGitHubText(event) {
    let target_element = event.toElement;
    let original_text = target_element.innerText;
    target_element.innerText = "View GitHub Repo";

    return original_text;
}

function changeToViewDemoText(event) {
    let target_element = event.toElement;
    let original_text = target_element.innerText;
    target_element.innerText = "View Demo Website";

    return original_text;
}

function changeToOriginalText(component, original_text) {
    component.innerText = original_text;
}

function githubTextOnHover() {
    let components = document.querySelectorAll(".github_link");
    components.forEach((component) => {
        let original_text = "";
        component.addEventListener('mouseover', function(event) {
            original_text = changeToGitHubText(event);
        });

        component.addEventListener('mouseout', function(){
            changeToOriginalText(component, original_text);
        });
    });
}

function webSiteTextHover() {
    let components = document.querySelectorAll(".project_link");
    components.forEach((component) => {
        let original_text = "";
        component.addEventListener('mouseover', function(event) {
            original_text = changeToViewDemoText(event);
        });

        component.addEventListener('mouseout', function(){
            changeToOriginalText(component, original_text);
        });
    });
}

//add mouse listener
document.addEventListener('mousemove', function() {
    let detail_view_element = document.querySelector("#detail_view_box");
    setComponentPosition(detail_view_element);
});

githubTextOnHover();
webSiteTextHover();

function expand(component) {
    console.log(component);
    let parent = component.closest('.project_preview_text');
    let target = parent.nextElementSibling;
    if (component.innerText === "+") {
        component.innerText = "-";
        target.style.width = "80%";
        target.style.margin = '0 10% 3em 10%';
        target.style.height = "100%";
        target.style.opacity = "1";
    } else {
        component.innerText = "+";
        target.style.margin = '0 10% 0 10%';
        target.style.width = "80%";
        target.style.height = "0";
        target.style.opacity = "0";
    }
}


