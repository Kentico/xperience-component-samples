import * as constants from "./macro-constants";
import { DialogMode, MacroType, ContextMacros } from "./macro-types";

const macroEditModeTemplate = require("./templates/macro-element.html");
const configureUrlMacroTemplate = require("./templates/configure-url-parameter-popup.html");
const configureContextMacroTemplate = require("./templates/configure-context-macro-popup.html");

export const getMacroEditModeElement = (macroType: MacroType, macroValue: string, macroDefaultValue: string, macroDisplayValue: string): string => {
    return macroEditModeTemplate({
        macroClass: constants.MACRO_CLASS,
        macroType,
        macroValue,
        macroDefaultValue,
        macroDisplayValue,
    });
}

export const getConfigureUrlParameterElement = (mode: DialogMode = DialogMode.INSERT, macroValue: string = "", macroDefaultValue: string = ""): string => {
    let templateValues;

    switch (mode) {
        case DialogMode.INSERT:
            templateValues = {
                value: macroValue,
                defaultValue: macroDefaultValue,
                actionButtonText: "Insert",
                defaultTextLabel: "Default text",
                urlParameterLabel: "URL parameter",
                command: constants.INSERT_URL_MACRO_COMMAND_NAME,
            };
            break;
        case DialogMode.UPDATE:
            templateValues = {
                value: macroValue,
                defaultValue: macroDefaultValue,
                actionButtonText: "Save",
                defaultTextLabel: "Default text",
                urlParameterLabel: "URL parameter",
                command: constants.UPDATE_URL_MACRO_COMMAND_NAME,
            };
            break;
    }

    return configureUrlMacroTemplate(templateValues);
};

export const getConfigureContextMacroElement = (mode: DialogMode, macros: ContextMacros, macroValue: string = "", macroDefaultValue: string = ""): string => {
    let templateValues;

    switch (mode) {
        case DialogMode.INSERT:
            templateValues = {
                macros,
                macroValue,
                macroDefaultValue,
                actionButtonText: "Insert",
                defaultTextLabel: "Default text",
                macroTypeLabel: "Contact attribute",
                command: constants.INSERT_CONTEXT_MACRO_COMMAND_NAME,
            }
        break;
        case DialogMode.UPDATE:
            templateValues = {
                macros,
                macroValue,
                macroDefaultValue,
                actionButtonText: "Save",
                defaultTextLabel: "Default text",
                macroTypeLabel: "Contact attribute",
                command: constants.UPDATE_CONTEXT_MACRO_COMMAND_NAME,
            }
        break;
    }

    return configureContextMacroTemplate(templateValues);
};
