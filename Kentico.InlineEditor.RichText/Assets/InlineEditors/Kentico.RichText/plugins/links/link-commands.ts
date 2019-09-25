import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";

import * as constants from "./link-constants";

import { FroalaCommand } from "../../froala-command";
import { FroalaIcon } from "../../froala-icon";

let linkText: string;
const openInsertLinkPopupCommandIcon = new FroalaIcon(constants.OPEN_INSERT_LINK_POPUP_COMMAND_NAME, {NAME: "link", SVG_KEY: "insertLink"});
const openInsertLinkPopupCommand = new FroalaCommand(constants.OPEN_INSERT_LINK_POPUP_COMMAND_NAME, {
    title: "Insert link",
    focus: false,
    undo: false,
    plugin: constants.LINK_PLUGIN_NAME,
    refreshAfterCallback: true,
    callback(this: FroalaEditor) {
        this.selection.save();
        linkText = this.selection.text();
        this.kenticoLinkPlugin.showInsertLinkPopup(this.position.getBoundingRect(), linkText);
    }
}, openInsertLinkPopupCommandIcon);


const closeLinkConfigurationPopupCommandIcon = new FroalaIcon(constants.CLOSE_CONFIGURE_LINK_POPUP_COMMAND_NAME, { NAME: "arrow-left", SVG_KEY: "back" });
const closeLinkConfigurationPopupCommand = new FroalaCommand(constants.CLOSE_CONFIGURE_LINK_POPUP_COMMAND_NAME, {
    title: "Back",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        this.kenticoMacroPlugin.hideConfigurationPopup();
    }
}, closeLinkConfigurationPopupCommandIcon);

export const linkCommands = [
    openInsertLinkPopupCommand,
    closeLinkConfigurationPopupCommand,
]
