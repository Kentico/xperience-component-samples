import { MACRO_CLASS, UPDATE_MACRO_COMMAND_NAME, INSERT_URL_MACRO_COMMAND_NAME, INSERT_CONTEXT_MACRO_COMMAND_NAME, UPDATE_CONTEXT_MACRO_COMMAND_NAME } from "./macro-constants";
import { DialogMode, MacroType } from "./macro-types";

const macroEditModeTemplate = require("./templates/macro-element.html");
const configureContextMacroTemplate = require("./templates/configure-context-macro-popup.html");

export const getMacroEditModeElement = (macroType: MacroType, macroValue: string, macroDefaultValue: string, macroDisplayValue: string): string => {
    return macroEditModeTemplate({
        macroClass: MACRO_CLASS,
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
                command: INSERT_URL_MACRO_COMMAND_NAME,
            };
            break;
        case DialogMode.UPDATE:
            templateValues = {
                value: macroValue,
                defaultValue: macroDefaultValue,
                actionButtonText: "Save",
                defaultTextLabel: "Default text",
                urlParameterLabel: "URL parameter",
                command: UPDATE_MACRO_COMMAND_NAME,
            };
            break;
    }

    return require("./templates/configure-url-parameter-popup.html")(templateValues);
};

export const getConfigureContextMacroElement = (mode: DialogMode, macroValue: string = "", macroDefaultValue: string = ""): string => {
    let templateValues;

    switch (mode) {
        case DialogMode.INSERT:
            templateValues = {
                macroValue,
                macroDefaultValue,
                actionButtonText: "Insert",
                defaultTextLabel: "Default text",
                macroTypeLabel: "Macro",
                command: INSERT_CONTEXT_MACRO_COMMAND_NAME,
            }
        break;
        case DialogMode.UPDATE:
            templateValues = {
                macroValue,
                macroDefaultValue,
                actionButtonText: "Save",
                defaultTextLabel: "Default text",
                macroTypeLabel: "Macro",
                command: UPDATE_CONTEXT_MACRO_COMMAND_NAME,
            }
        break;
    }

    return configureContextMacroTemplate(templateValues);
};
