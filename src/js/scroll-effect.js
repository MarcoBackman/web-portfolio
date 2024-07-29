function getScrollPositionRatio() {
    // get total height of the document
    let documentHeight = document.body.scrollHeight;

    // get current scroll position
    let scrollPosition = window.scrollY;
    return (scrollPosition / documentHeight) * 2;
}

function componentTransparentOnScroll(componentId, isDarkMode) {
    let scrollWeight = Math.exp(-getScrollPositionRatio());

    const targetComponent = document.getElementById(componentId);
    //get svg component
    if (targetComponent) {
        if (isDarkMode) {
            targetComponent.setAttribute('style', 'opacity:' + (0.9 + Math.log2(0.7 +scrollWeight)));
        } else {
            targetComponent.setAttribute('style', 'opacity:' + scrollWeight);
        }
    } else{
        console.log("Element with tag name '" + componentId + "' not found.");
    }

    return scrollWeight;
}

function fixNavBarAtTop(isDarkMode, scrollPos) {
    let scrollPosition = getScrollPositionRatio();
    let navBarComponent = document.getElementById("category_list");
    let backgroundColor;
    if (isDarkMode) {
        backgroundColor = "linear-gradient(80deg, #975a5e 36%, rgba(0, 0, 0, 0) 30%), linear-gradient(110deg, #453953 60%, #25161b 58%)";
    } else {
        backgroundColor = "linear-gradient(80deg, #ea9085 36%, rgba(0, 0, 0, 0) 30%), linear-gradient(110deg, #c06c84 58%, #6c5b7c 58%)";
    }

    if (navBarComponent) {
        if (scrollPosition >= scrollPos && window.innerWidth > 780) {
            navBarComponent.style.top = "0";
            navBarComponent.style.position = "fixed";
            navBarComponent.style.zIndex = "20";
            navBarComponent.style.setProperty('background', backgroundColor);
        } else {
            navBarComponent.style.position = "inherit";
            navBarComponent.style.zIndex = "auto";
            navBarComponent.style.background = "inherit"
        }
    }
}

function getScrollIntersectionObserver() {
    return new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }

            // Store flag in sessionStorage
            sessionStorage.setItem('hasBeenCalled', 'true');
        });
    });
}

function setActiveObserverOnceByName(id, resetTime) {
    let typeWriterActivatedOnce = sessionStorage.getItem(id + 'ActivatedOnce');
    const observer = getScrollIntersectionObserver();

    if(typeWriterActivatedOnce === "true") {
        document.querySelectorAll('#' + id).forEach(e => {
            observer.observe(e);
        });

        sessionStorage.setItem(id + 'ActivatedOnce', 'false');

    }

    setTimeout(() => {
        document.querySelectorAll('#' + id).forEach(e => {
            e.style.opacity = "1";
            observer.unobserve(e);
        });
    }, resetTime);
}