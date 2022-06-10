'use strict';
const CURRENCY_UNIX_SYMBOL_FILE = "https://webdatabucket.s3.us-east-2.amazonaws.com/currency_code.txt"
const CURRENCY_RATE_API = "https://www.bankofcanada.ca/valet/observations/group/FX_RATES_DAILY/xml?start_date=2017-01-03"

function ConvertHexToString(str) {
    return unescape(str.replace(/\\/g, "%"));
}

//Parse currency data from xml data
function parse_observation(observation) {
    //Key - country code, Value - currency rate
    let currency_rate = {};
    let currency_list = observation.querySelectorAll("v");
    currency_list.forEach(country => {
        let country_code = country.getAttribute('s');
        currency_rate[country_code.substring(2, 5)] = country.textContent
    });
    return currency_rate
}

//creates article element
function create_option(key, value, symbol) {
    let select = document.createElement("option");
    select.setAttribute("value", key);
    select.textContent = "(" + symbol + ") " + value;
    return select;
}

function add_currency_option(country_code, currency_symbols) {
    let currency_from_select = document.querySelector("#currency_from");
    let currency_to_select = document.querySelector("#currency_to");
    //clears existing content first
    for (const [key, value] of Object.entries(country_code)) {
        let new_option_from = create_option(key, value, currency_symbols[key]);
        let new_option_to = create_option(key, value, currency_symbols[key]);
        currency_from_select.appendChild(new_option_from);
        currency_to_select.appendChild(new_option_to);
    }
}

//parse currency symbol unicode
async function fetchSymbolData(currency_rate) {
    let currency_symbols = await fetch(CURRENCY_UNIX_SYMBOL_FILE, {
        //mode:'cors',
        method: 'GET',
        headers: {
            Accept: 'text/html'
        }
    }).then((response) => {
        return response.text();
    }).then(str => {
        let lines = str.split('\n');

        //Key - country code, Value - decoded unicode
        let currency_symbols = {};
        //Key - country code, Value - country name
        let country_code = {};

        lines.forEach(line => {
            let keywords = line.split('\t')
            //0 - country, 1 - code, 2- symbol
            if (keywords[1].trim() in currency_rate) {
                currency_symbols[keywords[1].trim()] = ConvertHexToString(keywords[2]);
                country_code[keywords[1].trim()] = keywords[0];
            }
        });

        //Add data to HTML components
        add_currency_option(country_code, currency_symbols);
        return currency_symbols;
    }).catch((error) => console.log(error));
    return currency_symbols;
}

//parse currency rate data - contains DOM format
async function fetchCurrencyRate() {
    //Gets lists of currecy objects(rate and symbols)
    let sets = await fetch(CURRENCY_RATE_API)
    .then(response => response.text())
    .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
    .then(async(data) => {
        var nodes = data.querySelectorAll("o");
        //only uses the most recent data
        var last_observation = nodes[nodes.length- 1];

        //update date
        let header = document.querySelector("#exchange_rate_headline");
        let current_date = last_observation.getAttribute("d");
        header.textContent = "Exchange Rates for " + current_date;

        //parse to observation
        let currency_rate = parse_observation(last_observation);

        //after parsing currency rate data, proceed to symbol data fetch
        let currency_symbols = await fetchSymbolData(currency_rate);
        return [currency_rate, currency_symbols];
    });
    return sets;
}


async function getInputData() {
    let select_from = document.querySelector("#currency_from");
    let select_to = document.querySelector("#currency_to");
    let user_input = document.querySelector("#user_amount");
    return { "select_from" : select_from.value.trim(),
             "select_to"  : select_to.value.trim(),
             "user_input"  : user_input.value.trim()};
}

function add_listeners(currency_rate, currency_symbols) {
    let submit_button = document.querySelector("#submit_button");
    let result_input = document.querySelector("#result");

    //convert to targeted currency
    function calcualte_currency(country_code_from, country_code_to, amount) {
        let from_rate = currency_rate[country_code_from];
        let to_rate = currency_rate[country_code_to];

        //from -> canadian-> to
        let final_value = (amount * from_rate) / to_rate;
        return final_value.toFixed(4);
    }

    //adds buttons' event listener with conditionals
    submit_button.addEventListener('click', async() => {
        let input_data = await getInputData();
        if (input_data["select_from"] === "-"
        || input_data["select_to"] === "-") {
            alert("Select currency type");
        } else if (input_data["select_from"] === input_data["select_to"]) {
            alert("Why would you do this?");
        } else if (isNaN(input_data["user_input"])) {
            alert("Please enter numbers");
        } else if (input_data["user_input"] === "") {
            alert("Please enter amount");
        } else if (input_data["user_input"] === "0") {
            alert("0?, Why would you do this?");
        } else if (input_data["user_input"] < 0) {
            alert("Enter positive value");
        } else {
            //if inputs are correct proceed to calculation
            let result = calcualte_currency(input_data["select_from"],
                                            input_data["select_to"],
                                            input_data["user_input"]);
            let result_currency_symbol = currency_symbols[input_data["select_to"]];
            result_input.value = result_currency_symbol + " " + result;
        }
    });
}

//Creates single symbol box component
function create_symbol_box(code, symbol) {
    //wrapper box
    let symbol_box = document.createElement("div");
    symbol_box.setAttribute("class", "symbol_box");

    //contents
    let country_code_p = document.createElement("p");
    let symbol_p = document.createElement("p");
    country_code_p.setAttribute("class", "country_code_p");
    symbol_p.setAttribute("class", "symbol_p");

    //set contents
    country_code_p.textContent = code;
    symbol_p.textContent = symbol;

    symbol_box.appendChild(country_code_p);
    symbol_box.appendChild(symbol_p);
    return symbol_box;
}

function add_symbol_boxes(currency_symbols) {
    let currency_symbol_div = document.querySelector("#currency_symbol_div");

    for (const [key, value] of Object.entries(currency_symbols)) {
        let symbol_box = create_symbol_box(key, value);
        currency_symbol_div.appendChild(symbol_box);
    }

}

async function main() {
    //Main method
    let sets = await fetchCurrencyRate();
    let currency_rate = sets[0];
    let currency_symbols = sets[1];

    //add symbol boxes to DOM
    add_symbol_boxes(currency_symbols);

    //set Listeners
    add_listeners(currency_rate, currency_symbols);
}

main();
