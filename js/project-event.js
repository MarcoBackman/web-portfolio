'use strict';
const RSS_LOCAL = `http://18.219.119.188:8080/rss`;
const DEFAULT_IMG = './../src/img/jsMeme.jpg';

const DAYS = {'Mon' : 'Monday',
        'Tue' : 'Tuesday',
        'Wed' : 'Wednesday',
        'Thu' : 'Thursday',
        'Fri' : 'Friday',
        'Sat' : 'Saturday',
        'Sun' : 'Sunday'};

const MONTHS = {'Jan' : 'January',
        'Feb' : 'Feburary',
        'Mar' : 'March',
        'Apr' : 'April',
        'May' : 'May',
        'Jun' : 'Jun',
        'Jul' : 'July',
        'Aug' : 'August',
        'Sep' : 'September',
        'Oct' : 'October',
        'Nov' : 'November',
        'Dec' : 'December'};

const MONTHS_NUM = {'Jan' : 1,
        'Feb' : 2,
        'Mar' : 3,
        'Apr' : 4,
        'May' : 5,
        'Jun' : 6,
        'Jul' : 7,
        'Aug' : 8,
        'Sep' : 9,
        'Oct' : 10,
        'Nov' : 11,
        'Dec' : 12};

function parse_image(img_source, link) {
    let a = document.createElement('a');
    a.setAttribute("href", link.textContent);

    let img = document.createElement('img');
    img.setAttribute("class", "box_img");
    if (img_source !== null) {
        img.src = img_source.getAttribute("url");
    } else {
        img.src = DEFAULT_IMG;
        img.setAttribute("max-height", "40%");
        img.setAttribute("width", "3rem");
    }

    a.appendChild(img);
    return a;
}

function create_div() {
    let div = document.createElement("article");
    div.setAttribute("class", "box_menu");
    return div;
}

function create_row_div() {
    let row_div = document.createElement("div");
    row_div.setAttribute("class", "box_menu_row");
    return row_div;
}

function create_title_h3(text) {
    let event_title = document.createElement('h3');
    event_title.setAttribute("class", "event_title");
    event_title.textContent = text.textContent;
    return event_title;
}

function create_time_p(text) {
    let event_start = document.createElement('p');
    event_start.setAttribute("class", "event_start");
    let date_time_text = toDateFormat(text.textContent);
    event_start.textContent = date_time_text;
    return event_start;
}

// Original: Wed, 02 Feb 2022 23:30:00 GMT
// -> MMMM, dd, YYYY, TZD
function toDateFormat(original_day_time) {
    let splitted_keywords = (original_day_time.replace(',', '')).split(' ');
    let year = splitted_keywords[3];
    let month = MONTHS_NUM[splitted_keywords[2]];
    let date = splitted_keywords[1];
    let wholeTime = splitted_keywords[4];
    let timeSet = wholeTime.split(':');
    let hour = timeSet[0];
    let minute = timeSet[1];
    let seconds = timeSet[2];

    let dateFormat = new Date(Date.UTC(year, month, date, hour, minute, seconds));

    let options = { weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    timeZone: splitted_keywords[5],
                    timeZoneName: 'short'};

    return dateFormat.toLocaleString('en-US', options);
}

function create_location_p(text) {
    let event_location = document.createElement('p');
    event_location.setAttribute("class", "event_location");
    event_location.textContent = text.textContent;
    return event_location;
}

//
function create_description_div(content) {
    let event_description_div = document.createElement('div');
    event_description_div.setAttribute("class", "event_description_div");
    event_description_div.innerHTML = content.textContent;
    return event_description_div;
}

function description_display(button) {
    let description_div = button.nextElementSibling;
    if (button.textContent == "learn more") {
        description_div.style.display = "block";
        button.textContent = "show less"
    } else {
        description_div.style.display = "none";
        button.textContent = "learn more"
    }
}

function getButton() {
    let btn = document.createElement('button');
    btn.setAttribute("class", "learn_btn");
    btn.textContent = "learn more";
    btn.addEventListener('click',
    () => description_display(btn)
    , false);
    return btn;
}

function isOverflown(element) {
    return element.clientHeight > 400;
}

function set_button(box_div, description_btn, event_description) {
    if(isOverflown(box_div) === true) {
        event_description.style.display = "none";
    } else {
        box_div.removeChild(description_btn);
    }
}

function filterByTitle() {

}

function filterByDesc() {

}

function filterByDate() {

}

function filterEvent(events, filterValue, filterFunction) {

}


document.addEventListener("DOMContentLoaded", async() => {

    let article_div = document.querySelector('#box_repeater');
    let filter_btn = document.querySelector("#filter_submit");
    let clear_btn = document.querySelector("#filter_clear");

    filter_btn.addEventListener('submit', () => {filterEvent(this, "to", "to")});
    clear_btn.addEventListener('click', () => {alert("cleared")});

    let rss_load = async() => {
        return await fetch(RSS_LOCAL)
          .then(response => response.text())
          .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
          .then(data => {
            let index = 0;
            const items = data.querySelectorAll("item");
            let row_div = create_row_div();
            items.forEach(item => {
                if (index % 5 == 0) {
                    row_div= create_row_div();
                    article_div.appendChild(row_div);
                }
                index = index + 1;

                let div = create_div();
                let image = item.querySelector("enclosure");
                let link = item.querySelector("link");
                let img_frame = parse_image(image, link);
                let event_title = create_title_h3(item.querySelector("title"));
                let event_start = create_time_p(item.querySelector("start"));
                let event_location = create_location_p(item.querySelector("location"));
                let description_btn = getButton();
                let event_description = create_description_div(item.querySelector("description"));
                div.appendChild(img_frame);
                div.appendChild(event_title);
                div.appendChild(event_start);
                div.appendChild(event_location);
                div.appendChild(description_btn);
                div.appendChild(event_description);
                row_div.appendChild(div);
                set_button(div, description_btn, event_description);
            });
        });
    }

    await rss_load();
});

