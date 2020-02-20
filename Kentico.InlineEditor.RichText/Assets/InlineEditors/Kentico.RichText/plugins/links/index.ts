import * as Froala from "froala-editor/js/froala_editor.pkgd.min";

import * as constants from "./link-constants";
import { linkPlugin } from "./link-plugin";
import { linkCommands } from "./link-commands";

export const initializeLinkPlugin = () => {
    // Define popup templates.
    Object.assign(Froala.POPUP_TEMPLATES, {
        [constants.INSERT_LINK_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
        [constants.CONFIGURE_PAGE_LINK_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
        [constants.CONFIGURE_GENERAL_LINK_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
        [constants.CONFIGURE_MEDIA_LINK_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
    });

    // Define popup buttons.
    Object.assign(Froala.DEFAULTS, {
        popupInsertLinkButtons: [constants.CLOSE_LINK_CONFIGURATION_POPUP_COMMAND_NAME, "|", constants.SWITCH_PAGE_LINK_TAB_COMMAND_NAME, constants.SWITCH_GENERAL_LINK_TAB_COMMAND_NAME, constants.SWITCH_MEDIA_LINK_TAB_COMMAND_NAME],
        popupUpdatePageLinkButtons: [constants.CLOSE_LINK_CONFIGURATION_POPUP_COMMAND_NAME, "|", constants.SWITCH_PAGE_LINK_TAB_COMMAND_NAME],
        popupUpdateGeneralLinkButtons: [constants.CLOSE_LINK_CONFIGURATION_POPUP_COMMAND_NAME, "|", constants.SWITCH_GENERAL_LINK_TAB_COMMAND_NAME],
        popupUpdateMediaLinkButtons: [constants.CLOSE_LINK_CONFIGURATION_POPUP_COMMAND_NAME, "|", constants.SWITCH_MEDIA_LINK_TAB_COMMAND_NAME],
    });

    linkCommands.forEach(command => command.register());

    Froala.PLUGINS[constants.LINK_PLUGIN_NAME] = linkPlugin;
}
