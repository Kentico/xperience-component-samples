import { ContextMacro } from "./macro-types";

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