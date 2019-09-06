import * as commands from "./macro-commands";
import * as constants from "./macro-constants";
import { macroPlugin } from "./macro-plugin";
import { Froala } from "../plugin-types";

export const initializeMacroPlugin = (froala: Froala) => {
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

    froala.DefineIcon(constants.OPEN_INSERT_MACRO_POPUP_COMMAND_NAME, {
        PATH: constants.ICON_MACRO,
        template: "svg",
    });
    froala.RegisterCommand(constants.OPEN_INSERT_MACRO_POPUP_COMMAND_NAME, commands.openInsertMacroPopupCommand);
    froala.RegisterCommand(constants.REMOVE_MACRO_COMMAND_NAME, commands.removeMacroCommand);

    froala.DefineIcon(constants.CONFIGURE_MACRO_COMMAND_NAME, {
        NAME: "bullhorn",
        SVG_KEY: "cogs"
    });
    froala.RegisterCommand(constants.CONFIGURE_MACRO_COMMAND_NAME, commands.configureMacroCommand);

    froala.DefineIcon('popupConfigureClose', { NAME: 'times', SVG_KEY: 'back' });
    froala.RegisterCommand(constants.CLOSE_CONFIGURE_POPUP_COMMAND_NAME, commands.closeConfigurePopupCommand);

    froala.DefineIcon("macro", { PATH: constants.ICON_MACRO, template: "svg" });
    froala.RegisterCommand(constants.SWITCH_MACRO_TAB_COMMAND_NAME, commands.openMacroTabCommand);

    froala.DefineIcon("queryString", { PATH: constants.ICON_URL_PARAM, template: "svg" });
    froala.RegisterCommand(constants.SWITCH_URL_TAB_COMMAND_NAME, commands.openQueryTabCommand);

    froala.RegisterCommand(constants.INSERT_MACRO_COMMAND_NAME, commands.insertMacro);
    froala.RegisterCommand(constants.UPDATE_MACRO_COMMAND_NAME, commands.updateMacro);

    froala.RegisterCommand(constants.INSERT_URL_MACRO_COMMAND_NAME, commands.insertMacro);
    froala.RegisterCommand(constants.INSERT_CONTEXT_MACRO_COMMAND_NAME, commands.insertMacro);
    froala.RegisterCommand(constants.UPDATE_CONTEXT_MACRO_COMMAND_NAME, commands.updateMacro);

    froala.PLUGINS[constants.MACROS_PLUGIN_NAME] = macroPlugin;
}
