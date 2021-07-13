'use strict'

const slider = document.querySelector('.slider'),
    sliderElements = Array.from(slider.querySelectorAll('.slider__element'));
let isDragging = false,
    startPosition = 0,
    currentPosition = 0,
    currentTranslate = 0,
    prevTranslate = 0,
    currentIndex = 0,
    animationID;

sliderElements.forEach( (element, index) => {
    // touch events
    element.addEventListener('touchstart', startDragging);
    element.addEventListener('touchmove', dragging);
    element.addEventListener('touchend', stopDragging);

    // mouse events
    element.addEventListener('mousedown', startDragging);
    element.addEventListener('mousemove', dragging);
    element.addEventListener('mouseup', stopDragging);
    element.addEventListener('mouseleave', stopDragging);

    // preventing image from dragging
    element.addEventListener('dragstart', (e) => {
        e.preventDefault();
    });
});

// preventing context menu from poping-up and interrupting element dragging
window.oncontextmenu = function (event) {
    event.preventDefault();
};

function startDragging(event) {
    isDragging = true;
    startPosition = getPositionX(event);
    sliderElements[currentIndex].classList.add('grabbing');
    animationID = requestAnimationFrame(animation);
}

function dragging(event) {
    if(isDragging) {
        currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + currentPosition - startPosition;
    }
}

function stopDragging(event) {
    sliderElements[currentIndex].classList.remove('grabbing');
    let movedBy = currentPosition - startPosition;

    if(isDragging) {
        if(movedBy < -100 && currentIndex < sliderElements.length - 1) currentIndex += 1;
        if(movedBy > 100 && currentIndex > 0) currentIndex -= 1;

        cancelAnimationFrame(animationID);
        setPositionByIndex();
    }
    isDragging = false;
}

function getPositionX(event) {
    return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function animation() {
    setSliderPositionX();
    if(isDragging) requestAnimationFrame(animation);
}

function setSliderPositionX() {
    slider.style.transform = `translateX(${currentTranslate}px)`;
}

function setPositionByIndex() {
    currentTranslate = currentIndex * -window.innerWidth;
    prevTranslate = currentTranslate;
    setSliderPositionX();
}