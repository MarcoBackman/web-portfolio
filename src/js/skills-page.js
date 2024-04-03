function setDetailPanelPosition() {
    //On initial loads
    $(document).ready(function () {
        if (window.scrollY < 150) {
            $(".skill-detail-panel").css("top", "250px");
        } else {
            $(".skill-detail-panel").css("top", "5%");
        }
    });

    //Dynamic scroll event
    window.addEventListener('scroll', (event) => {
        if (this.scrollY < 150) {
            $(".skill-detail-panel").css("top", "250px");
        } else if (this.scrollY > 1400) { //Todo: refactor this to calculate the percentage instead
            $(".skill-detail-panel").css("top", "1%");
        } else {
            $(".skill-detail-panel").css("top", "5%");
        }
    });
}

async function getRssData(path) {
    let doc = "";
    await fetch(path)
        .then(function(response) {
            // When the page is loaded convert it to text
            return response.text()
        })
        .then(function(html) {
            // Initialize the DOM parser
            var parser = new DOMParser();

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
        console.log(arrayData[i]);
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
    let fullText = ""
    for (let contentIndex = 0; contentIndex < contents.length; contentIndex++) {
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
        //Add comma if sentence does not end with comma
        if (fullText.endsWith(".") === false) {
            fullText += ".";
        }
        fullText += '</br>'
    }
    return fullText;
}

function setSkillContent(xmlDataMap, xmlId, htmlId) {
    let mappedXmlContent = xmlDataMap.get(xmlId);
    //Read title
    let title = mappedXmlContent.getElementsByTagName("title")[0] != null ?
        mappedXmlContent.getElementsByTagName("title")[0].innerText : "";

    //define title html component
    let titleComp = '<h2>' + title + '</h2>'
    let listComp = '<ul>';

    //Set html child components by each list
    for(let i = 0; i < mappedXmlContent.getElementsByTagName("list").length; i++) {
        listComp += '<li>'
        let list = mappedXmlContent.getElementsByTagName("list")[i];
        let subCategory = list.getElementsByTagName("subject")[0].innerText;
        let content = parseAndApplyBoldFromContent(list.getElementsByTagName("content"));
        listComp += '<p>' + subCategory.toUpperCase()
            + '<span class="box-subcategory-title">:</br> ' + content + '</span>' + '</p>';
        listComp += '</li>'
    }

    listComp += '</ul>';

    //set html components
    document.getElementById(htmlId).innerHTML = titleComp + listComp;
}