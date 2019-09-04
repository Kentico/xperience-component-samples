import { MACRO_CLASS } from "./macro-constants";
import { getMacroEditModeElement } from "./macro-templates";
import { MacroType } from "./macro-types";

export const replaceMacroElements = (html: string): string => {
    const tempWrapper = document.createElement("div");
    tempWrapper.innerHTML = html;

    const macros = tempWrapper.querySelectorAll(`.${MACRO_CLASS}`);
    macros.forEach((macro) => macro.replaceWith("{{ Username }}"));

    return tempWrapper.innerHTML;
}

export const replaceMacrosWithElements = (html: string): string => {
    return html.replace(/{{ Username }}/g, getMacroEditModeElement(MacroType.URL, "product", "coffee"));
}
