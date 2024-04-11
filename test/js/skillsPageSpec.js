//test for src/js/skills-page.js

describe(`parseAndApplyBoldFromContent()
        - checks if comma is added when not provided
        - checks if newline is added on each content
        `,
    () => {

    it("returns hello world", async () => {
        let testContents = await getXmlFileData("../../test/resources/contents-test1.xml");
        let contentValue = testContents[0].getElementsByTagName("content");
        let actual = parseAndApplyBoldFromContent(contentValue);
        console.log(actual);
        expect(actual.endsWith(".</br>")).toBeTrue();
    });
})

// describe("parseAndApplyBoldFromContent() skip operation when comma exists",
//     () => {
//         it("returns hello world", () => {
//             var actual = helloWorld();
//             expect(actual).toBe("hello world");
//         });
//     })