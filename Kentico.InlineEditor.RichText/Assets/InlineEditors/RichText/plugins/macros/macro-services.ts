import { MACRO_CLASS } from "./macro-constants";
import { MacroType, MacroElementTemplateResolver } from "./macro-types";
import { getMacroDisplayName } from "./macro-helpers";

const macroTextRegex = /{%\s*(?<pattern>[\w\.]+)\s*(\|\(default\)(?<defaultValue>.*?))?%}/g

export const replaceMacroElements = (html: string): string => {
    const tempWrapper = document.createElement("div");
    tempWrapper.innerHTML = html;

    const macroElements = tempWrapper.querySelectorAll<HTMLElement>(`.${MACRO_CLASS}`);
    macroElements.forEach((macro) => {
        const macroValue = macro.dataset.macroValue!;
        const macroDefaultValue = macro.dataset.macroDefaultValue!;

        macro.replaceWith(`{% ${macroValue} ${macroDefaultValue ? `|(default) ${macroDefaultValue} `: ""}%}`);
    });

    return tempWrapper.innerHTML;
}

export const replaceMacrosWithElements = (html: string, macroElementTemplateResolver: MacroElementTemplateResolver): string => {
    return html.replace(macroTextRegex, (match, pattern: string, defaultValueMatch: string, defaultValue: string) => {
        const macroType = pattern.startsWith("QueryString") ? MacroType.URL : MacroType.CONTEXT;
        const macroValue = macroType === MacroType.URL ? pattern.split(".")[1] : pattern;
        defaultValue = defaultValue ? defaultValue.trim() : defaultValue;

        return macroElementTemplateResolver(macroType, pattern, defaultValue, getMacroDisplayName(macroValue))
    });
}
