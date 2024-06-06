'use strict';
//hosted rss feed server
const EVENT_DATA = `../data/events.rss`;
const DEFAULT_IMG = '../data/jsMeme.jpg';
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

//creates img tag
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

//creates article element
function create_div() {
    let div = document.createElement("article");
    div.setAttribute("class", "box_menu");
    return div;
}

//creates row div element
function create_row_div() {
    let row_div = document.createElement("div");
    row_div.setAttribute("class", "box_menu_row");
    return row_div;
}

//creates title element
function create_title_h3(text) {
    let event_title = document.createElement('h3');
    event_title.setAttribute("class", "event_title");
    event_title.textContent = text.textContent;
    return event_title;
}

//creates timeline element
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
    let split_keywords = (original_day_time.replace(',', '')).split(' ');
    let year = split_keywords[3];
    let month = MONTHS_NUM[split_keywords[2]];
    let date = split_keywords[1];
    let wholeTime = split_keywords[4];
    let timeSet = wholeTime.split(':');
    let hour = timeSet[0];
    let minute = timeSet[1];
    let seconds = timeSet[2];

    let dateFormat = new Date(Date.UTC(year, month - 1, date, hour, minute, seconds));

    return dateFormat.toLocaleString('en-US', { weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'America/New_York',
        timeZoneName: 'short'});
}
//Date format parser for rss feed
function toInputDateFormat(original_day_time) {
    let split_keywords = (original_day_time.replace(',', '')).split(' ');
    let year = split_keywords[3];
    let month = MONTHS_NUM[split_keywords[2]];
    let date = split_keywords[1];
    return parseInt(month) + "/" + parseInt(date) + "/" + parseInt(year);
}

//Date format parser for user input
function toCompareDateFormat(input_date) {
    input_date = input_date.trim();
    let numbers = (input_date.split("/"));
    let month = numbers[0];
    let date = numbers[1];
    let year = numbers[2];
    return parseInt(month) + "/" + parseInt(date) + "/" + parseInt(year);
}

//creates location p element
function create_location_p(text) {
    let event_location = document.createElement('p');
    event_location.setAttribute("class", "event_location");
    event_location.textContent = text.textContent;
    return event_location;
}

//creates description div element
function create_description_div(content) {
    let event_description_div = document.createElement('div');
    event_description_div.setAttribute("class", "event_description_div");
    event_description_div.innerHTML = content.textContent;
    return event_description_div;
}

//control display on button click
function description_display(button) {
    let description_div = button.nextElementSibling;
    if (button.textContent === "learn more") {
        description_div.style.display = "block";
        button.textContent = "show less"
    } else {
        description_div.style.display = "none";
        button.textContent = "learn more"
    }
}

//creates new button
function getButton() {
    let btn = document.createElement('button');
    btn.setAttribute("class", "learn_btn");
    btn.textContent = "learn more";
    btn.addEventListener('click',
        () => description_display(btn)
        , false);
    return btn;
}

//identifies the content overflow
function isOverflown(element) {
    return element.clientHeight > 400;
}

//append button on overflow
function set_button(box_div, description_btn, event_description) {
    if(isOverflown(box_div) === true) {
        event_description.style.display = "none";
    } else {
        box_div.removeChild(description_btn);
    }
}

//returns target events from given events by title
let filterByTitle = function(events, value) {
    return new Promise(function(resolve, reject) {
        let event_list = [];
        events.forEach(item =>{
            let title_item = item.querySelector("title");
            //found matched
            if (title_item.textContent.toLowerCase().match(value.toLowerCase()) !== null) {
                event_list.push(item);
            }
        });

        if (value === "") {
            resolve(events);
        } else if (event_list.length !== 0) {
            resolve(event_list);
        } else {
            alert("title not found");
            resolve(events);
        }
    });
}

//returns target events from given events by description
let filterByDesc = function(events, value) {
    return new Promise(function(resolve, reject) {
        let event_list = [];
        events.forEach(item =>{
            let description_item = item.querySelector("description");
            //found matched
            if (description_item.textContent.toLowerCase().match(value.toLowerCase()) !== null) {
                event_list.push(item);
            }
        });

        if (value === "") {
            resolve(events);
        } else if (event_list.length !== 0) {
            resolve(event_list);
        } else {
            alert("Description not found");
            resolve(events);
        }
    });
}

//returns target events from given events by date
var filterByDate = function(events, value) {
    return new Promise(function(resolve, reject) {
        let event_list = [];
        events.forEach(item =>{
            let date_item = item.querySelector("start");
            console.log(value)
            let date_form = toInputDateFormat(date_item.textContent);
            if (value) {
                if (value === "MM/DD/YYYY") { //ignores default date format input
                    event_list.push(item);
                } else if (date_form.match(toCompareDateFormat(value)) !== null) {
                    event_list.push(item);
                }
            }
        });

        if (!value) {
            resolve(events);
        } else if (event_list.length !== 0) {
            resolve(event_list);
        } else {
            alert("date not found");
            resolve(events);
        }
    });
}

//Filters events by given values
function filterEvents(events, filterValue, filterFunction) {
    filterFunction(events, filterValue["title"])
        .then(filtered_by_title => {
            filterByDesc(filtered_by_title, filterValue["desc"])
                .then(filtered_by_desc => {
                    filterByDate(filtered_by_desc, filterValue["date"])
                        .then(final_events => {
                            viewAllEvents(final_events);
                        })})});
}

//get rss data
// - promise based, no need for additional async setup
const fetch_event =
    fetch(EVENT_DATA)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => {
            return (data.querySelectorAll("item"));
        });

//get input fields on request
// - async required to get input before execution
async function getInputData() {
    let title_input = document.querySelector("#title_input");
    let desc_input = document.querySelector("#desc_input");
    let date_input = document.querySelector("#date_input");
    return { "title" : title_input.value.trim(),
        "desc"  : desc_input.value.trim(),
        "date"  : date_input.value.trim()};
}


//clears data on filter clear button click
// - async required to clear content before execution
async function clearFilter() {
    let title_input = document.querySelector("#title_input");
    let desc_input = document.querySelector("#desc_input");
    let date_input = document.querySelector("#date_input");
    title_input.value = "";
    desc_input.value = "";
    date_input.value = "";
}

//for initial page load up
function getDefaultInputData() {
    return { "title" : "",
        "desc"  : "",
        "date"  : ""};
}

//displays events
// - async required for retrieving input data before getting events
const getEvent = async () => {
    //need to wait for promise data to be fulfilled
    const events = await fetch_event;

    let filter_btn = document.querySelector("#filter_submit");
    let clear_btn = document.querySelector("#filter_clear");

    //adds buttons' event listeners
    // - async required
    filter_btn.addEventListener('click', async() => {
        let input_data = await getInputData();
        filterEvents(events, input_data, filterByTitle)
    });
    clear_btn.addEventListener('click', () => clearFilter());

    //runs this on load by default
    filterEvents(events, { "title":"", "desc":"", "date":""}, filterByTitle);
};

//removes all children
function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

//displays components by given events
function viewAllEvents(events) {
    let index = 0;
    let box_repeater = document.querySelector("#box_repeater");
    let row_div = create_row_div();
    //clears existing content first
    removeAllChildNodes(box_repeater);

    //adds all required card-like elements into main container
    events.forEach(item => {
        if (index % 5 === 0) {
            row_div= create_row_div();
            box_repeater.appendChild(row_div);
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
}

//Main method
getEvent();