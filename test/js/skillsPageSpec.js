const TEST_DATA_FILE = "../../test/resources/contents-test1.xml";

describe(`parseAndApplyBoldFromContent()
        - checks if comma is added when not provided
        - checks if newline is added on each content
        `,
    () => {

    it("Parsed and converted html hag has correct styling and format", async () => {
        let testContents = await getXmlData(null, SUPPORTED_LANGUAGES.ENGLISH, TEST_DATA_FILE);
        expect(testContents[0].tagName).toBe("SKILL");
        let contentValue = testContents[0].getElementsByTagName("content");
        let actual = parseAndApplyBoldFromContent(contentValue);
        expect(actual.includes("without comma end.</br>")).toBeTrue();
        expect(actual.includes("<span class=\"bold-span\" style=\"font-weight: bold\">stream processing</span>")).toBeTrue();
        expect(actual.endsWith(".</br>")).toBeTrue();
    });
});

describe(`
            Language Validation Tests
        `,
    () => {
    it("returns true on supported language: en", async () => {
        let result = checkLanguageValidation(SUPPORTED_LANGUAGES.ENGLISH);
        expect(result).toBeTrue();
    });

    it("returns true on supported language: kr", async () => {
        let result = checkLanguageValidation(SUPPORTED_LANGUAGES.KOREAN);
        expect(result).toBeTrue();
    });

    it("returns false on unsupported language", async () => {
        let result = checkLanguageValidation("sdawgfkr");
        expect(result).toBeFalse();
    });
});

describe(`
            Path assembly test for XML files
        `,
() => {
    it("returns empty on invalid path", async () => {
        let result = resolvePath("abdw2out", SUPPORTED_LANGUAGES.ENGLISH, null);
        expect(result).toMatch("");
    });

    it("returns empty on invalid path", async () => {
        let result = resolvePath(XML_FILE_TYPE.ABOUT, SUPPORTED_LANGUAGES.ENGLISH, null);
        expect(result).toMatch("../../document/en/about-me.xml");
    });

    it("returns empty on invalid path", async () => {
        let result = resolvePath(XML_FILE_TYPE.SKILL, SUPPORTED_LANGUAGES.ENGLISH, null);
        expect(result).toMatch("../../document/en/skills.xml");
    });

    it("returns empty on invalid path", async () => {
        let result = resolvePath(XML_FILE_TYPE.INTRO, SUPPORTED_LANGUAGES.ENGLISH, null);
        expect(result).toMatch("../../document/en/introduction.xml");
    });
});