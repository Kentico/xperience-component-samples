import { Froala } from "@/types/kentico";
import { macroCommands } from "./macro-commands";
import * as constants from "./macro-constants";
import { macroPlugin } from "./macro-plugin";

export const initializeMacroPlugin = (froala: Froala, element: HTMLElement) => {
    // Define popup templates.
    Object.assign(froala.POPUP_TEMPLATES, {
        [constants.ACTIONS_POPUP_NAME]: "[_BUTTONS_]",
        [constants.CONFIGURATION_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
        [constants.CONFIGURE_URL_MACRO_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
        [constants.CONFIGURE_CONTEXT_MACRO_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
    });

    // Define popup buttons.
    Object.assign(froala.DEFAULTS, {
        popupActionButtons: [constants.REMOVE_MACRO_COMMAND_NAME, constants.CONFIGURE_MACRO_COMMAND_NAME],
        popupConfigureButtons: [constants.CLOSE_CONFIGURE_POPUP_COMMAND_NAME, "|", constants.SWITCH_URL_TAB_COMMAND_NAME, constants.SWITCH_MACRO_TAB_COMMAND_NAME],
        popupEditUrlMacroButtons: [constants.CLOSE_CONFIGURE_POPUP_COMMAND_NAME, "|", constants.SWITCH_URL_TAB_COMMAND_NAME],
        popupEditContextMacroButtons: [constants.CLOSE_CONFIGURE_POPUP_COMMAND_NAME, "|", constants.SWITCH_MACRO_TAB_COMMAND_NAME]
    });
    
    const contextMacros = element.dataset.contextMacros;
    if (contextMacros) {
        Object.assign(froala.DEFAULTS, {
            contextMacros: JSON.parse(contextMacros),
        });
    }

    macroCommands.forEach(({ commandName, commandParameters, commandIcon }) => {
        froala.RegisterCommand(commandName, commandParameters);
        
        if (commandIcon) {
            froala.DefineIcon(commandIcon.iconName, commandIcon.iconParameters);
        }
    })

    froala.PLUGINS[constants.MACROS_PLUGIN_NAME] = macroPlugin;

    // Hide specific buttons in the built-in plugins
    const videoInsertButtons = froala.DEFAULTS.videoInsertButtons || [];
    delete videoInsertButtons[videoInsertButtons.indexOf("videoUpload")];
}
