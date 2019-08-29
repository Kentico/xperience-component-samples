import * as f from "froala-editor/js/froala_editor.pkgd.min";

import * as commands from "./macro-commands";
import * as constants from "./macro-constants";
import { macroPlugin } from "./macro-plugin";
import { Froala } from "../plugin-types";

export const initializeMacroPlugin = (froala: Froala) => {
    const { MACROS_PLUGIN_NAME, REMOVE_MACRO_COMMAND_NAME, CONFIGURE_MACRO_COMMAND_NAME, INSERT_MACRO_COMMAND_NAME } = constants;
    const { configureMacroCommand, insertMacroCommand, removeMacroCommand } = commands;

    // Define popup template.
    Object.assign(froala.POPUP_TEMPLATES, {
        [`${MACROS_PLUGIN_NAME}.popup`]: "[_BUTTONS_]"
    });

    // Define popup buttons.
    Object.assign(f.DEFAULTS, {
        popupButtons: [REMOVE_MACRO_COMMAND_NAME, CONFIGURE_MACRO_COMMAND_NAME],
    });

    froala.DefineIcon(INSERT_MACRO_COMMAND_NAME, {
        NAME: "plus",
        SVG_KEY: "add"
    });
    froala.RegisterCommand(INSERT_MACRO_COMMAND_NAME, insertMacroCommand);
    froala.RegisterCommand(REMOVE_MACRO_COMMAND_NAME, removeMacroCommand);

    froala.DefineIcon(CONFIGURE_MACRO_COMMAND_NAME, {
        NAME: "bullhorn",
        SVG_KEY: "cogs"
    });
    froala.RegisterCommand(CONFIGURE_MACRO_COMMAND_NAME, configureMacroCommand);

    froala.PLUGINS[MACROS_PLUGIN_NAME] = macroPlugin;
}
