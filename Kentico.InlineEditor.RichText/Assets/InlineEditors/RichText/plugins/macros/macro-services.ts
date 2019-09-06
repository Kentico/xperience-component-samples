import { MACRO_CLASS } from "./macro-constants";
import { getMacroEditModeElement } from "./macro-templates";
import { MacroType } from "./macro-types";
import { getContextMacroDisplayName } from "./macro-helpers";

const macroTextRegex = /{%\s*(?<pattern>[\S]*)\s*(\|\s*\(default\)\s*(?<defaultValue>\S*)\s*)?%}/g;

export const replaceMacroElements = (html: string): string => {
    const tempWrapper = document.createElement("div");
    tempWrapper.innerHTML = html;

    const macroElements = tempWrapper.querySelectorAll<HTMLElement>(`.${MACRO_CLASS}`);
    macroElements.forEach((macro) => {
        const macroValue = macro.dataset.macroValue!;
        const macroDefaultValue = macro.dataset.macroDefaultValue!;

        macro.replaceWith(`{% ${macroValue} ${macroDefaultValue ? `| (default) ${macroDefaultValue} `: ""}%}`);
    });

    return tempWrapper.innerHTML;
}

export const replaceMacrosWithElements = (html: string): string => {
    return html.replace(macroTextRegex, (match, pattern: string, defaultValueMatch: string, defaultValue: string) => {
        const macroType = pattern.startsWith("QueryString") ? MacroType.URL : MacroType.CONTEXT;
        const macroValue = macroType === MacroType.URL ? pattern.split(".")[1] : pattern;

        return getMacroEditModeElement(macroType, macroValue, defaultValue, getContextMacroDisplayName(macroValue))
    });
}
