import { replaceMacrosWithElements } from "../macro-services";
import { MacroElementTemplateResolver, MacroType } from "../macro-types";

const testHtml =
`<div>
    <p>Hello</p>
    <p>{% QueryString.Test %}</p>
    <p>{% QueryString.Test | (default) TestQueryString %}</p>
    <p>{% ContactManagementContext.CurrentContact.ContactFirstName %}</p>
    <p>{% ContactManagementContext.CurrentContact.ContactFirstName | (default) TestFirstName %}</p>
    <p>{% ContactManagementContext.CurrentContact.ContactLastName %}</p>
    <p>{% ContactManagementContext.CurrentContact.ContactLastName | (default) TestLastName %}</p>
    <p>{% ContactManagementContext.CurrentContact.ContactDescriptiveName %}</p>
    <p>{% ContactManagementContext.CurrentContact.ContactDescriptiveName | (default) TestDescriptiveName %}</p>
</div>`;

const fakeMacroElementTemplateResolver: MacroElementTemplateResolver = (macroType, macroValue, macroDefaultValue, macroDisplayValue) => {
    return `<span contenteditable="false" class="ktc-macro fr-deletable" data-macro-type="${macroType}" data-macro-value="${macroValue}" data-macro-default-value="${macroDefaultValue || ""}">${macroDisplayValue}</span>`
}

const getMacroElementAttributes = (macroType: MacroType, macroValue: string, macroDefaultValue: string = "") =>
    `contenteditable="false" class="ktc-macro fr-deletable" data-macro-type="${macroType}" data-macro-value="${macroValue}" data-macro-default-value="${macroDefaultValue}"`

const expectedResult = 
`<div>
    <p>Hello</p>
    <p><span ${getMacroElementAttributes(MacroType.URL, "QueryString.Test")}>param: Test</span></p>
    <p><span ${getMacroElementAttributes(MacroType.URL, "QueryString.Test", "TestQueryString")}>param: Test</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactManagementContext.CurrentContact.ContactFirstName")}>First name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactManagementContext.CurrentContact.ContactFirstName", "TestFirstName")}>First name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactManagementContext.CurrentContact.ContactLastName")}>Last name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactManagementContext.CurrentContact.ContactLastName", "TestLastName")}>Last name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactManagementContext.CurrentContact.ContactDescriptiveName")}>Full name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactManagementContext.CurrentContact.ContactDescriptiveName", "TestDescriptiveName")}>Full name</span></p>
</div>`

describe("macro services", () => {
    describe("replaceMacrosWithElements", () => {
        it("should replace macros with macro elements", () => {
            const result = replaceMacrosWithElements(testHtml, fakeMacroElementTemplateResolver);
            
            expect(result).toBe(expectedResult);
        });
    });
});