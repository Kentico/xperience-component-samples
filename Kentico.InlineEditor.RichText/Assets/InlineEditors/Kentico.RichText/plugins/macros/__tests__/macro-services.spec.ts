import * as macroHelpers from "../macro-helpers";
import * as macroTemplateResolvers from "../macro-templates";
import { replaceMacrosWithElements, replaceMacroElements, removeMacros } from "../macro-services";
import { MacroType } from "../macro-types";

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
    <p>{%%}</p>
    <p>{%  %}</p>
    <p>{% ResolveDynamicText %}</p>
</div>`;

const fakeMacroElementTemplateResolver = (macroType: MacroType, macroValue: string, macroDefaultValue: string, macroDisplayValue: string) => {
    return `<input class="ktc-macro" value="${macroDisplayValue}" data-macro-type="${macroType}" data-macro-value="${macroValue}" data-macro-default-value="${macroDefaultValue || ""}" />`;
}

const getMacroElementAttributes = (macroType: MacroType, macroValue: string, macroDisplayValue: string, macroDefaultValue: string = "") =>
    `class="ktc-macro" value="${macroDisplayValue}" data-macro-type="${macroType}" data-macro-value="${macroValue}" data-macro-default-value="${macroDefaultValue}"`;

const htmlWithMacroElements = 
`<div>
    <p>Hello</p>
    <p><input ${getMacroElementAttributes(MacroType.URL, "Test", "param: Test")} /></p>
    <p><input ${getMacroElementAttributes(MacroType.URL, "Test", "param: Test", "TestQueryString")} /></p>
    <p><input ${getMacroElementAttributes(MacroType.CONTEXT, "ContactFirstName", "First name")} /></p>
    <p><input ${getMacroElementAttributes(MacroType.CONTEXT, "ContactFirstName", "First name", "TestFirstName")} /></p>
    <p><input ${getMacroElementAttributes(MacroType.CONTEXT, "ContactLastName", "Last name")} /></p>
    <p><input ${getMacroElementAttributes(MacroType.CONTEXT, "ContactLastName", "Last name", "TestLastName")} /></p>
    <p><input ${getMacroElementAttributes(MacroType.CONTEXT, "ContactDescriptiveName", "Full name")} /></p>
    <p><input ${getMacroElementAttributes(MacroType.CONTEXT, "ContactDescriptiveName", "Full name", "TestDescriptiveName")} /></p>
    <p>{%%}</p>
    <p>{%  %}</p>
    <p>{% ResolveDynamicText %}</p>
</div>`;


const htmlWithoutMacros =
`<div>
    <p>Hello</p>
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <p></p>
    <p>{%%}</p>
    <p>{%  %}</p>
    <p>{% ResolveDynamicText %}</p>
</div>`;


describe("macro services", () => {
    describe("replaceMacroElements", () => {
        it("should replace macro elements with macros", () => {
            const result = replaceMacroElements(htmlWithMacroElements);

            expect(result).toBe(htmlWithMacros);
        });
    });

    describe("removeMacros", () => {
        it("should replace macros with an empty string", () => {
            const result = removeMacros(htmlWithMacros);

            expect(result).toBe(htmlWithoutMacros);
        });
    });

    describe("replaceMacrosWithElements", () => {
        it("should replace macros with macro elements", () => {
            jest.spyOn(macroHelpers, "getString").mockImplementation(() => "param");
            jest.spyOn(macroTemplateResolvers, "getMacroEditModeElement").mockImplementation(fakeMacroElementTemplateResolver);

            const result = replaceMacrosWithElements(htmlWithMacros, contextMacros);
            
            expect(result).toBe(htmlWithMacroElements);
        });
    });
});