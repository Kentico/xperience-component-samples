import { ContextMacro } from "./macro-types";

/**
 * Returns native HTML element which is wrapped by provided jQuery object.
 * @param $element jQuery object which targets the element.
 * @returns HTML element or null.
 */
export const unwrapElement = <T extends HTMLElement>($element: JQuery): T | null => {
    if ($element) {
        return ($element as any)[0] as T;
    }

    return null;
}

export const getContextMacroDisplayName = (macro: string) => {
    switch (macro) {
        case ContextMacro.FIRST_NAME:
            return "First name";
        case ContextMacro.LAST_NAME:
            return "Last name";
        case ContextMacro.FULL_NAME:
            return "Full name";
        default:
            return `param: ${macro}`;
    }
}