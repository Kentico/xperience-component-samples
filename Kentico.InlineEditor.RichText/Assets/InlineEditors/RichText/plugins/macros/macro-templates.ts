import { MACRO_CLASS } from "./macro-constants";

const macroEditModeTemplate = require("./templates/macro-element.html")({
    macroClass: MACRO_CLASS,
});

export const getMacroEditModeElement = (): string => macroEditModeTemplate;