import * as Froala from "froala-editor/js/froala_editor.pkgd.min";

import { macroCommands } from "./macro-commands";
import * as constants from "./macro-constants";
import { macroPlugin } from "./macro-plugin";

export const initializeMacroPlugin = () => {
    // Define popup templates.
    Object.assign(Froala.POPUP_TEMPLATES, {
        [constants.ACTIONS_POPUP_NAME]: "[_BUTTONS_]",
        [constants.CONFIGURATION_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
        [constants.CONFIGURE_URL_MACRO_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
        [constants.CONFIGURE_CONTEXT_MACRO_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
    });

    // Define popup buttons.
    Object.assign(Froala.DEFAULTS, {
        popupActionButtons: [constants.REMOVE_MACRO_COMMAND_NAME, constants.CONFIGURE_MACRO_COMMAND_NAME],
        popupConfigureButtons: [constants.CLOSE_CONFIGURE_POPUP_COMMAND_NAME, "|", constants.SWITCH_URL_TAB_COMMAND_NAME, constants.SWITCH_MACRO_TAB_COMMAND_NAME],
        popupEditUrlMacroButtons: [constants.CLOSE_CONFIGURE_POPUP_COMMAND_NAME, "|", constants.SWITCH_URL_TAB_COMMAND_NAME],
        popupEditContextMacroButtons: [constants.CLOSE_CONFIGURE_POPUP_COMMAND_NAME, "|", constants.SWITCH_MACRO_TAB_COMMAND_NAME]
    });
    
    macroCommands.forEach(command => command.register());

    Froala.PLUGINS[constants.MACROS_PLUGIN_NAME] = macroPlugin;
}
