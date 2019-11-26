import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

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

/**
 * Binds 'onclick' listener to Macro Elements.
 * @param editor Froala editor instance.
 */
export const bindMacroClickListener = (editor: FroalaEditor) => {
    const macros = editor.el.querySelectorAll<HTMLInputElement>(`.${MACRO_CLASS}`);

    macros.forEach((macroEl) => {
        macroEl.onclick = () => editor.kenticoMacroPlugin.showActionsPopup(macroEl);
        // Prevents from showing the default froala button popup on right click 
        macroEl.onmousedown = (event) => event.stopPropagation();
    });
}