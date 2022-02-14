const RSS_LOCAL = `./../src/data/events.rss`;
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
    let div = document.createElement("div");
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
    date_time_text = toDateFormat(text.textContent);
    event_start.textContent = date_time_text;
    return event_start;
}

// Original: Wed, 02 Feb 2022 23:30:00 GMT
// -> MMMM, dd, YYYY, TZD
function toDateFormat(original_day_time) {
    final_text = ""
    original_day_time = original_day_time.replace(',', '');
    splitted_keywords = original_day_time.split(' ');
    final_text += DAYS[splitted_keywords[0]] + " ";
    final_text += MONTHS[splitted_keywords[2]] + " ";
    final_text += splitted_keywords[3] + " ";
    final_text += splitted_keywords[5] + " ";
    return final_text;
}

function create_location_p(text) {
    let event_location = document.createElement('p');
    event_location.setAttribute("class", "event_location");
    event_location.textContent = text.textContent;
    return event_location;
}

function create_description_div(content) {
    let event_description_div = document.createElement('div');
    event_description_div.setAttribute("class", "event_description_div");
    event_description_div.innerHTML = content.textContent;
    return event_description_div;
}

function expand(compoment) {
    let div_component = compoment.parentElement; 
    let target_description = div_component.querySelector('.event_description_div');
    console.log(div_component);
    console.log(target_description);
    target_description.style.display = "block";
    let description_hieght = target_description.style.gridTemplateRows; 
    console.log(target_description.style.height);
    let div_height = div_component.style.gridTemplateRows;
    console.log(description_hieght + div_height);
    div_component.style.gridTemplateRows  = description_hieght + div_height + "px";
}

function create_learn_button() {
    let learn_more_btn = document.createElement('button');
    learn_more_btn.setAttribute("class", "learn_btn");
    learn_more_btn.textContent = "learn more";
    learn_more_btn.setAttribute("onclick", "expand(this)")
    return learn_more_btn;
}

function check_box_resize(target_box, div, article_div, row_div) {
    
    let height = target_box.offsetHeight;
    console.log(height);
    if (height > 110) {
        console.log("hiding");
        target_box.style.display = "none";
        btn = create_learn_button();
        div.appendChild(btn);
    }
    //removed rendered data
}

document.addEventListener("DOMContentLoaded", () => {

    article_div = document.querySelector('#box_repeater');

    const read_rss = async() => {
        return await fetch(RSS_LOCAL)
          .then(response => response.text())
          .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
          .then(data => {
            let index = 0;
            const items = data.querySelectorAll("item");
            let row_div = create_row_div();
            items.forEach(event_items = item => {
                if (index % 5 == 0) {
                    article_div.appendChild(row_div);
                    row_div= create_row_div();
                }
                index = index + 1;

                let div = create_div();
                let image = item.querySelector("enclosure");
                let link = item.querySelector("link");
                let img_frame = parse_image(image, link);
                let event_title = create_title_h3(item.querySelector("title"));
                let event_start = create_time_p(item.querySelector("start"));
                let event_end = create_time_p(item.querySelector("end"));
                let event_location = create_location_p(item.querySelector("location"));
                let event_description = create_description_div(item.querySelector("description"));
                div.appendChild(img_frame);
                div.appendChild(event_title);
                div.appendChild(event_start);
                div.appendChild(event_location);
                div.appendChild(event_description);
                row_div.appendChild(div);

                //check_box_resize(event_description, div, article_div, row_div);
            });
        });
    }

    read_rss();
});



//console.log(html_data());