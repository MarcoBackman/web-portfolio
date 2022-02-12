const RSS_LOCAL = `./../src/data/events.rss`;

const html_data = async() => {
    return await fetch(RSS_LOCAL)
        .then(response => response.text())
        .then(str => new window.DOMParser().parseFromString(str, "text/xml"))
        .then(data => data.querySelectorAll("item"))
}

console.log(html_data());