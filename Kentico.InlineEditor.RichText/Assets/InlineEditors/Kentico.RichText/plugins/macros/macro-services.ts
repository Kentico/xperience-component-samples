import { MACRO_CLASS } from "./macro-constants";
import { MacroType, ContextMacros } from "./macro-types";
import { getMacroDisplayName } from "./macro-helpers";
import { getMacroEditModeElement } from "./macro-templates";

const dynamicTextRegex = /{%\s*ResolveDynamicText\(\s*"(query|pattern)"\s*,\s*"([^"]+)"\s*,\s*"([^"]*)"\s*\)\s*%}/g

export const replaceMacroElements = (html: string): string => {
    const tempWrapper = document.createElement("div");
    tempWrapper.innerHTML = html;

    const macroElements = tempWrapper.querySelectorAll<HTMLElement>(`.${MACRO_CLASS}`);
    macroElements.forEach((macro) => {
        const { macroType, macroValue, macroDefaultValue} = macro.dataset as { macroType: MacroType, macroValue: string, macroDefaultValue: string };
        macro.replaceWith(`{% ResolveDynamicText("${macroType}", "${macroValue}", "${macroDefaultValue}") %}`);
    });

    return tempWrapper.innerHTML;
}

export const replaceMacrosWithElements = (html: string, macros: ContextMacros): string => {
    return html.replace(dynamicTextRegex, (_, macroType: MacroType, macroValue: string, macroDefaultValue: string) => {
        return getMacroEditModeElement(macroType, macroValue, macroDefaultValue, getMacroDisplayName(macros, macroValue));
    });
}
