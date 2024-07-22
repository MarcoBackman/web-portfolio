const SUFFIX = '-skill-detail-text';

//Call this after xml.parse.js is loaded
function setSkillContentToHtml(xmlDataMap) {
    setSkillContent(xmlDataMap, "java", "java" + SUFFIX);
    setSkillContent(xmlDataMap, "python", "python" + SUFFIX);
    setSkillContent(xmlDataMap, "front-end", "front-end" + SUFFIX);
    setSkillContent(xmlDataMap, "database", "database" + SUFFIX);
    setSkillContent(xmlDataMap, "os", "os" + SUFFIX);
    setSkillContent(xmlDataMap, "cicd", "cicd" + SUFFIX);
    setSkillContent(xmlDataMap, "cloud-service", "cloud" + SUFFIX);
    setSkillContent(xmlDataMap, "extra", "extra" + SUFFIX);
}