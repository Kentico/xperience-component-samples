import { MACRO_CLASS } from "./macro-constants";

const macroEditModeTemplate = require("./templates/macro-element.html")({
    macroClass: MACRO_CLASS,
});

const configureUrlParameterTemplate = require("./templates/configure-url-parameter-popup.html")({
    actionButtonText: "Insert",
    defaultTextLabel: "Default text",
    urlParameterLabel: "URL parameter",
});

const configureMacroTemplate = require("./templates/configure-macro-popup.html")({
    actionButtonText: "Insert",
    defaultTextLabel: "Default text",
    macroTypeLabel: "Macro",
});


export const getMacroEditModeElement = (): string => macroEditModeTemplate;
export const getConfigureUrlParameterElement = (): string => configureUrlParameterTemplate;
export const getConfigureMacroElement = (): string => configureMacroTemplate;
