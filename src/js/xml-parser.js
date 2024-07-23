const BASE_PATH = "../../document/"
const BASE_PATH_INDEX_PAGE = "../src/document/"
const ABOUT_ME_FILE_NAME = "/about-me.xml"
const INTRO_FILE_NAME = "/introduction.xml"
const SKILLS_FILE_NAME = "/skills.xml"
const SKILLS_FILE_NAME_KR = "/skills.xml"

const SUPPORTED_LANGUAGES = Object.freeze({
    ENGLISH : "en",
    KOREAN : "kr"
});

const XML_FILE_TYPE = Object.freeze({
    ABOUT : "about",
    INTRO : "intro",
    SKILL : "skills"
});

function checkLanguageValidation(languageCode) {
    switch (languageCode.toLowerCase()) {
        case SUPPORTED_LANGUAGES.KOREAN:
            return true;
        case SUPPORTED_LANGUAGES.ENGLISH:
            return true;
        default:
            return false;
    }
}

function resolvePath(pathName, language, overridePath) {
    let path;
    if (overridePath !== null) {
        path = overridePath;
    } else {
        switch (pathName.trim().toLowerCase()) {
            case XML_FILE_TYPE.ABOUT:
                path = BASE_PATH + language.toLowerCase() + ABOUT_ME_FILE_NAME;
                break;
            case XML_FILE_TYPE.INTRO:
                path = BASE_PATH_INDEX_PAGE + language.toLowerCase() + INTRO_FILE_NAME;
                break;
            case XML_FILE_TYPE.SKILL:
                path = BASE_PATH + language.toLowerCase() + SKILLS_FILE_NAME;
                break;
            default:
                console.log("Invalid pathName given=" + pathName);
                return "";
        }
    }
    return path;
}

async function getXmlData(pathName, language, overridePath) {

    //validate language code
    if (checkLanguageValidation === false) {
        return "";
    }

    let path = resolvePath(pathName, language, overridePath);

    let doc = "";
    await fetch(path)
        .then(function(response) {
            // When the page is loaded convert it to text
            return response.text()
        })
        .then(function(html) {
            // Initialize the DOM parser
            const parser = new DOMParser();

            // Parse the text
            doc = parser.parseFromString(html, "text/html");
        })
        .catch(function(err) {
            console.log('Failed to fetch page: ', err);
        });
    return doc.getElementsByTagName("skill");
}

function convertArrayToMap(arrayData) {
    const map = new Map();
    for (let i = 0; i < arrayData.length; i++) {
        map.set(arrayData[i].id, arrayData[i]);
    }
    return map;
}


/**
 * Find bold tag in XML and set with bold style with span html tag to make specific keyword 'bold'
 * Multiple contents will be separated with new line
 * @returns {string}
 * @param contents
 */
function parseAndApplyBoldFromContent(contents) {
    if (contents === "") return "";
    let fullText = ""
    for (let contentIndex = 0; contentIndex < contents.length; contentIndex++) {
        fullText += "<p class='description-text'>";
        let content = contents[contentIndex];
        for (let i = 0; i < content.childNodes.length; i++) {
            if (content.childNodes[i].hasChildNodes() === true &&
                content.childNodes[i].tagName.toUpperCase() === 'BOLD') {
                fullText += '<span class="bold-span" style="font-weight: bold">'
                    + content.childNodes[i].innerText + '</span>';
            } else {
                fullText += content.childNodes[i].data;
            }
        }
        fullText = fullText.trim();
        //Add comma if sentence does not end with comma
        if (fullText.endsWith('.') || fullText.endsWith('.\n') || fullText === "<p class='description-text'>") {
            // Do nothing, already properly ended.
        } else {
            // Add a dot at the end but not a newline
            fullText += '.';
        }
        fullText += '</p>';
    }
    return fullText;
}

function setSkillContent(xmlDataMap, xmlId, htmlId) {
    let mappedXmlContent = xmlDataMap.get(xmlId);
    //Read title
    let titles = mappedXmlContent.getElementsByTagName("title");
    let title = "";

    if (titles && titles.length > 0 && titles[0] !== undefined && titles[0].innerText !== undefined) {
        title = titles[0].innerText || "";
    }

    //define title html component
    let titleComp = '<h2>' + title + '</h2>'
    let listComp = '<ul>';

    //Set html child components by each list
    for(let i = 0; i < mappedXmlContent.getElementsByTagName("list").length; i++) {
        listComp += '<li class="description-list">'
        let list = mappedXmlContent.getElementsByTagName("list")[i];

        let subCategories = list.getElementsByTagName("subject");
        let subCategory = "";
        if (subCategories && subCategories.length > 0 && subCategories[0] !== undefined && subCategories[0].innerText !== undefined) {
            subCategory = subCategories[0].innerText || "";
        }
        let content = parseAndApplyBoldFromContent(list.getElementsByTagName("content"));
        listComp += '<p class="sub-title">' + (subCategory !== "" ? (subCategory
            + '<span>:</br> ') : "") + content + '</span>' + '</p>';
        listComp += '</li>'
    }
    listComp += '</ul>';

    //set html components
    document.getElementById(htmlId).innerHTML = listComp;
}