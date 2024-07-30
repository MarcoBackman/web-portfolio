function getScrollPositionRatio() {
    // get total height of the document
    let documentHeight = document.body.scrollHeight;

    // get current scroll position
    let scrollPosition = window.scrollY;
    //Todo: remove multiplication by 2 and fix every scroll features
    return (scrollPosition / documentHeight);
}

function getScrollPositionRatioByHeight(height) {
    // get total height of the document
    let documentHeight = document.body.scrollHeight;

    //Todo: remove multiplication by 2 and fix every scroll features
    return (height / documentHeight);
}

function componentTransparentOnScroll(componentId, isDarkMode) {
    let scrollWeight = Math.exp(-getScrollPositionRatio() * 2);

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

function calculateCurrentRage() {

}

//// ((0 ~ 1) * 0.2) + 0.8
function calculateElementScrollRate(elementScrollRangeRate) {
    const minRate = 0.5;
    const range = 0.2;
    return (1 - (elementScrollRangeRate)) + minRate;
}

function setComponentShape(element, rate) {
    element.style.transform = 'scaleY(' + (0.6 * rate) + ') perspective(' + (700 * rate) + 'px) ' +
        'rotateX(' + (45 * rate) + 'deg)';

    let h4Element = element.children[0]; //h4
    h4Element.style.transform = 'scaleY(' + (3 * rate) + ')'
        + 'rotateX(' + (-35 * rate) + 'deg) translateY(' + (3 * rate) + 'px)';

    let imgElement = element.children[1]; //img
    imgElement.style.transform = 'scaleY(' + (0.9 * rate) + ')'
        + 'rotateX(' + (25 * rate) + 'deg) perspective(' + (1600 * rate) + 'px)';
}

function resetComponentTransform(element) {
    element.style.transform = '';

    let h4Element = element.children[0]; //h4
    h4Element.style.transform = '';

    let imgElement = element.children[1]; //img
    imgElement.style.transform = '';
}

function componentsTrapezoidEffect(element, startTiltPos, endTiltPos) {
    let positionRatio = getScrollPositionRatio() + 0.15;
    let start = getScrollPositionRatioByHeight(startTiltPos);
    let end = getScrollPositionRatioByHeight(endTiltPos) + 0.15;
    //if current scroll rate matches the component position
    if (positionRatio >= start && positionRatio < end) {
        //calculate ratio 0.8 ~ 1 by total scrolls;
        let elementScrollRangeRate = (positionRatio - start) / (end - start);
        let newRatio = calculateElementScrollRate(elementScrollRangeRate);
        setComponentShape(element, newRatio);
    } else if (positionRatio < start) {
        resetComponentTransform(element);
    }
}

function fixNavBarAtTop(isDarkMode, scrollPos) {
    let scrollPosition = getScrollPositionRatio() * 2;
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