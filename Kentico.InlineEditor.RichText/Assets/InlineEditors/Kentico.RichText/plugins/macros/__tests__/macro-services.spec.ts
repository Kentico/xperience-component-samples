import { replaceMacrosWithElements, replaceMacroElements } from "../macro-services";
import { MacroElementTemplateResolver, MacroType } from "../macro-types";

const contextMacros = {
    "ContactFirstName": "First name",
    "ContactLastName": "Last name",
    "ContactDescriptiveName": "Full name",
}

const htmlWithMacros =
`<div>
    <p>Hello</p>
    <p>{% ResolveDynamicText("query", "Test", "") %}</p>
    <p>{% ResolveDynamicText("query", "Test", "TestQueryString") %}</p>
    <p>{% ResolveDynamicText("pattern", "ContactFirstName", "") %}</p>
    <p>{% ResolveDynamicText("pattern", "ContactFirstName", "TestFirstName") %}</p>
    <p>{% ResolveDynamicText("pattern", "ContactLastName", "") %}</p>
    <p>{% ResolveDynamicText("pattern", "ContactLastName", "TestLastName") %}</p>
    <p>{% ResolveDynamicText("pattern", "ContactDescriptiveName", "") %}</p>
    <p>{% ResolveDynamicText("pattern", "ContactDescriptiveName", "TestDescriptiveName") %}</p>
</div>`;

const fakeMacroElementTemplateResolver: MacroElementTemplateResolver = (macroType, macroValue, macroDefaultValue, macroDisplayValue) => {
    return `<span contenteditable="false" class="ktc-macro fr-deletable" data-macro-type="${macroType}" data-macro-value="${macroValue}" data-macro-default-value="${macroDefaultValue || ""}">${macroDisplayValue}</span>`
}

const getMacroElementAttributes = (macroType: MacroType, macroValue: string, macroDefaultValue: string = "") =>
    `contenteditable="false" class="ktc-macro fr-deletable" data-macro-type="${macroType}" data-macro-value="${macroValue}" data-macro-default-value="${macroDefaultValue}"`

const htmlWithMacroElements = 
`<div>
    <p>Hello</p>
    <p><span ${getMacroElementAttributes(MacroType.URL, "Test")}>param: Test</span></p>
    <p><span ${getMacroElementAttributes(MacroType.URL, "Test", "TestQueryString")}>param: Test</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactFirstName")}>First name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactFirstName", "TestFirstName")}>First name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactLastName")}>Last name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactLastName", "TestLastName")}>Last name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactDescriptiveName")}>Full name</span></p>
    <p><span ${getMacroElementAttributes(MacroType.CONTEXT, "ContactDescriptiveName", "TestDescriptiveName")}>Full name</span></p>
</div>`

describe("macro services", () => {
    describe("replaceMacroElements", () => {
        it("should replace macro elements with macros", () => {
            const result = replaceMacroElements(htmlWithMacroElements);

            expect(result).toBe(htmlWithMacros);
        });
    });

    describe("replaceMacrosWithElements", () => {
        it("should replace macros with macro elements", () => {
            const result = replaceMacrosWithElements(htmlWithMacros, contextMacros, fakeMacroElementTemplateResolver);
            
            expect(result).toBe(htmlWithMacroElements);
        });
    });
});