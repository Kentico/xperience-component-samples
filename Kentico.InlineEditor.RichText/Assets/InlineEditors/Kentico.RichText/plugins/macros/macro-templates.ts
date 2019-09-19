import * as constants from "./macro-constants";
import { DialogMode, MacroType, ContextMacros } from "./macro-types";
import { getString } from "./macro-helpers";

const macroEditModeTemplate = require("./templates/macro-element.html");
const configureUrlMacroTemplate = require("./templates/configure-url-parameter-popup.html");
const configureContextMacroTemplate = require("./templates/configure-context-macro-popup.html");

export const getMacroEditModeElement = (macroType: MacroType, macroValue: string, macroDefaultValue: string, macroDisplayValue: string): string =>
    macroEditModeTemplate({
        macroClass: constants.MACRO_CLASS,
        macroType,
        macroValue,
        macroDefaultValue,
        macroDisplayValue,
    });

export const getConfigureUrlParameterElement = (mode: DialogMode = DialogMode.INSERT, macroValue: string = "", macroDefaultValue: string = ""): string =>
    configureUrlMacroTemplate({
        value: macroValue,
        defaultValue: macroDefaultValue,
        actionButtonText: mode === DialogMode.INSERT ? getString("ActionButton.Insert") : getString("ActionButton.Save"),
        defaultTextLabel: getString("Label.DefaultText"),
        urlParameterLabel: getString("Label.UrlParameter"),
        command: mode === DialogMode.INSERT ? constants.INSERT_URL_MACRO_COMMAND_NAME : constants.UPDATE_URL_MACRO_COMMAND_NAME,
    });

export const getConfigureContextMacroElement = (mode: DialogMode, macros: ContextMacros, macroValue: string = "", macroDefaultValue: string = ""): string =>
    configureContextMacroTemplate({
        macros,
        macroValue,
        macroDefaultValue,
        actionButtonText: mode === DialogMode.INSERT ? getString("ActionButton.Insert") : getString("ActionButton.Save"),
        defaultTextLabel: getString("Label.DefaultText"),
        macroTypeLabel: getString("Label.ContactAttribute"),
        command: mode === DialogMode.INSERT ? constants.INSERT_CONTEXT_MACRO_COMMAND_NAME : constants.UPDATE_CONTEXT_MACRO_COMMAND_NAME,
    });
