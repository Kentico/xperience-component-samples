import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import _escape from "lodash/escape";
import _unescape from "lodash/unescape";

import { MACRO_CLASS } from "./macro-constants";
import { MacroType, ContextMacros } from "./macro-types";
import { getMacroDisplayName } from "./macro-helpers";
import { getMacroEditModeElement } from "./macro-templates";

const macroElementRegex = /<input [^>]*data-macro-type="(query|pattern)[^>]*>/g;
const macroValueRegex = /data-macro-value="([^"]*)"/;
const macroDefaultValueRegex = /data-macro-default-value="([^"]*)"/;
const dynamicTextRegex = /{%\s*ResolveDynamicText\(\s*"(query|pattern)"\s*,\s*"([^"]+)"\s*,\s*"(.*?)"\s*\)\s*%}/g

export const replaceMacroElements = (html: string): string => {
    return html.replace(macroElementRegex, (regexMatch: string, macroType: string) => {
        const macroValue = regexMatch.match(macroValueRegex)?.[1] ?? "";
        const macroDefaultValue = _unescape(regexMatch.match(macroDefaultValueRegex)?.[1]);
        
        return `{% ResolveDynamicText("${macroType}", "${macroValue}", "${macroDefaultValue.replace(/"/g, "\\\"")}") %}`;
    });
}

export const replaceMacrosWithElements = (html: string, macros: ContextMacros): string => {
    return html.replace(dynamicTextRegex, (_, macroType: MacroType, macroValue: string, macroDefaultValue: string) => {
        return getMacroEditModeElement(macroType, macroValue, _escape(macroDefaultValue.replace(/\\"/g, "\"")), getMacroDisplayName(macros, macroValue));
    });
}

export const removeMacros = (html: string): string => html.replace(dynamicTextRegex, "");

/**
 * Binds 'onclick' listener to Macro Elements.
 * @param editor Froala editor instance.
 */
export const bindMacroClickListener = (editor: FroalaEditor) => {
    const macros = editor.el.querySelectorAll<HTMLInputElement>(`.${MACRO_CLASS}`);

    macros.forEach((macroEl) => {
        macroEl.onclick = () => editor.kenticoMacroPlugin.showActionsPopup(macroEl);
        
        // Prevents from showing the default froala button popup on right click 
        macroEl.onmousedown = (event) => {
            if (event.button === 2) {
                event.stopPropagation();
            }
        };
    });
}