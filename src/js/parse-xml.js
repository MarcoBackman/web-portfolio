const abountMePageDocPath = "./../src/document/about-me.xml"
const indexPageDocPath = "./src/document/introduction.xml"
function parseDataForIndexPage() {
    let parser = new DOMParser();
    var loc = window.location.pathname;
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    console.log(loc)
    let parsedData = parser.parseFromString('/src/document/introduction.xml', "text/xml");
    console.log(parsedData);
    return new XMLSerializer().serializeToString(parsedData);
}