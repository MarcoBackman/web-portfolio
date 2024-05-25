function getScrollPositionRatio() {
    // get total height of the document
    let documentHeight = document.body.scrollHeight;

    // get current scroll position
    let scrollPosition = window.scrollY;
    return scrollPosition / documentHeight
}

function componentTransparentOnScroll(componentId) {
    let scrollWeight = Math.exp(-getScrollPositionRatio());

    const targetComponent = document.getElementById(componentId);
    //get svg component
    if (targetComponent) {
        targetComponent.setAttribute('style', 'opacity:' + scrollWeight);
    } else{
        console.log("Element with tag name '" + componentId + "' not found.");
    }

    return scrollWeight;
}

function fixNavBarAtTop() {
    let scrollPosition = getScrollPositionRatio();
    let navBarComponent = document.getElementById("category_list");

    if (navBarComponent) {
        if (scrollPosition >= 0.125) {
            navBarComponent.style.top = "1em";
            navBarComponent.style.position = "fixed";
            navBarComponent.style.zIndex = "1000";
        } else {
            navBarComponent.style.position = "inherit";
            navBarComponent.style.zIndex = "auto";
        }
    }
}