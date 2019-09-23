import * as constants from "./macro-constants";
import { DialogMode, MacroType, ContextMacros } from "./macro-types";
import { getString } from "./macro-helpers";

export const getMacroEditModeElement = (macroType: MacroType, macroValue: string, macroDefaultValue: string, macroDisplayValue: string): string =>
    require("./templates/macro-element.html")({
        macroClass: constants.MACRO_CLASS,
        macroType,
        macroValue,
        macroDefaultValue,
        macroDisplayValue,
    });

export const getConfigureUrlParameterElement = (mode: DialogMode = DialogMode.INSERT, macroValue: string = "", macroDefaultValue: string = ""): string =>
    require("./templates/configure-url-parameter-popup.html")({
        value: macroValue,
        defaultValue: macroDefaultValue,
        actionButtonText: mode === DialogMode.INSERT ? getString("ActionButton.Insert") : getString("ActionButton.Save"),
        defaultTextLabel: getString("Label.DefaultText"),
        urlParameterLabel: getString("Label.UrlParameter"),
        command: mode === DialogMode.INSERT ? constants.INSERT_URL_MACRO_COMMAND_NAME : constants.UPDATE_URL_MACRO_COMMAND_NAME,
    });

export const getConfigureContextMacroElement = (mode: DialogMode, macros: ContextMacros, macroValue: string = "", macroDefaultValue: string = ""): string =>
    require("./templates/configure-context-macro-popup.html")({
        macros,
        macroValue,
        macroDefaultValue,
        actionButtonText: mode === DialogMode.INSERT ? getString("ActionButton.Insert") : getString("ActionButton.Save"),
        defaultTextLabel: getString("Label.DefaultText"),
        macroTypeLabel: getString("Label.ContactAttribute"),
        command: mode === DialogMode.INSERT ? constants.INSERT_CONTEXT_MACRO_COMMAND_NAME : constants.UPDATE_CONTEXT_MACRO_COMMAND_NAME,
    });
