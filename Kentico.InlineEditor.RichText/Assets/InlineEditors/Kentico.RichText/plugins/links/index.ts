import { Froala } from "../plugin-types";

import * as constants from "./link-constants";
import { linkPlugin } from "./link-plugin";
import { linkCommands } from "./link-commands";

export const initializeLinkPlugin = (froala: Froala, element: HTMLElement) => {
    // Define popup templates.
    Object.assign(froala.POPUP_TEMPLATES, {
        [constants.INSERT_LINK_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
        [constants.UPDATE_LINK_POPUP_NAME]: "[_BUTTONS_][_CUSTOM_LAYER_]",
    });

    // Define popup buttons.
    Object.assign(froala.DEFAULTS, {
        popupInsertLinkButtons: [constants.CLOSE_CONFIGURE_LINK_POPUP_COMMAND_NAME, "|", constants.SWITCH_PATH_TAB_COMMAND_NAME],
        popupUpdateLinkButtons: [constants.CLOSE_CONFIGURE_LINK_POPUP_COMMAND_NAME, "|", constants.SWITCH_PATH_TAB_COMMAND_NAME],
    });

    const getPageEndpointUrl = element.dataset.getPageEndpointUrl;
    if (getPageEndpointUrl) {
        Object.assign(froala.DEFAULTS, {
            getPageEndpointUrl
        });
    }

    linkCommands.forEach(({ commandName, commandParameters, commandIcon }) => {
        froala.RegisterCommand(commandName, commandParameters);
        
        if (commandIcon) {
            froala.DefineIcon(commandIcon.iconName, commandIcon.iconParameters);
        }
    })

    froala.PLUGINS[constants.LINK_PLUGIN_NAME] = linkPlugin;
}
