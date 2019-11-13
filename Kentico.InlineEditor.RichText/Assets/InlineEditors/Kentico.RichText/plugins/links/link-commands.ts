import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";

import * as constants from "./link-constants";

import { FroalaCommand } from "../../froala-command";
import { FroalaIcon } from "../../froala-icon";
import { getString } from "./link-helpers";
import { getDialogElement } from "../popup-helper";
import { DialogMode } from "../plugin-types";
import { LinkDescriptor, LinkType } from "./link-types";
import { showForm } from "./popups/link-edit-popup";

let selectedLink: HTMLAnchorElement;
let defaultLinkDescriptor: LinkDescriptor;

const openInsertLinkPopupCommandIcon = new FroalaIcon(constants.OPEN_INSERT_LINK_POPUP_COMMAND_NAME, { NAME: "link", SVG_KEY: "insertLink" });
const openInsertLinkPopupCommand = new FroalaCommand(constants.OPEN_INSERT_LINK_POPUP_COMMAND_NAME, {
    title: getString("Command.InsertLink"),
    focus: false,
    undo: false,
    plugin: constants.LINK_PLUGIN_NAME,
    refreshAfterCallback: true,
    callback(this: FroalaEditor) {
        this.selection.save();
        const linkText = this.selection.text();
        defaultLinkDescriptor = { 
            linkText: (linkText.trim().length === 0) ? "" : linkText,
            linkUrl: "",
            openInNewTab: false
        };
        this.kenticoLinkPlugin.showLinkPopup(this.position.getBoundingRect(), defaultLinkDescriptor);
    }
}, openInsertLinkPopupCommandIcon);


const closeLinkConfigurationPopupCommandIcon = new FroalaIcon(constants.CLOSE_CONFIGURE_LINK_POPUP_COMMAND_NAME, { NAME: "arrow-left", SVG_KEY: "back" });
const closeLinkConfigurationPopupCommand = new FroalaCommand(constants.CLOSE_CONFIGURE_LINK_POPUP_COMMAND_NAME, {
    title: getString("Command.Back"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        this.kenticoLinkPlugin.hideLinkConfigurationPopup();
    }
}, closeLinkConfigurationPopupCommandIcon);

const insertOrUpdateLinkCommandParameters: RegisterCommandParameters = {
    title: "",
    undo: true,
    focus: false,
    callback(this: FroalaEditor, command: string) {
        const popupName = command === constants.INSERT_PAGE_LINK_COMMAND_NAME ? constants.INSERT_LINK_POPUP_NAME : constants.CONFIGURE_PAGE_LINK_POPUP_NAME;
        const popupElement = getDialogElement(this, popupName);

        if (popupElement) {
            this.undo.saveStep();
            const form = popupElement.querySelector<HTMLFormElement>("#ktc-form");
            const formData = new FormData(form!);
            const path = formData.get("linkUrl") as string;
            let text = formData.get("linkText") as string;
            const openInNewTab = Boolean(formData.get("openInNewTab"));

            if (!path) {
                this.kenticoLinkPlugin.hideLinkConfigurationPopup();
                return;
            }
            if (!text) {
                text = popupElement.querySelector<HTMLElement>(".ktc-page-name")!.innerText;
            }

            if (command === constants.INSERT_PAGE_LINK_COMMAND_NAME) {
                this.link.insert(path, text, openInNewTab ? {target: "_blank"} : undefined);
            } else if (command === constants.UPDATE_LINK_COMMAND_NAME && selectedLink) {
                selectedLink.setAttribute("href", path);
                selectedLink.innerText = text;
                
                if (openInNewTab){
                    selectedLink.setAttribute("target", "_blank");
                }
                else {
                    selectedLink.removeAttribute("target");
                }
            }

            this.kenticoLinkPlugin.hideLinkConfigurationPopup();
        }
    }
};

const insertPageLinkCommand = new FroalaCommand(constants.INSERT_PAGE_LINK_COMMAND_NAME, insertOrUpdateLinkCommandParameters);
const updatePageLinkCommand = new FroalaCommand(constants.UPDATE_LINK_COMMAND_NAME, insertOrUpdateLinkCommandParameters);

const editPageLinkIcon = new FroalaIcon(constants.OPEN_EDIT_LINK_POPUP_COMMAND_NAME, { NAME: "edit", SVG_KEY: "editLink" });
const editPageLinkCommand = new FroalaCommand(constants.OPEN_EDIT_LINK_POPUP_COMMAND_NAME, {
    title: getString("Command.EditLink"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        selectedLink = this.link.get() as HTMLAnchorElement;
        const relatedElementPosition = this.position.getBoundingRect();
        const linkDescriptor: LinkDescriptor = {
            linkText: selectedLink.text,
            linkUrl: selectedLink.getAttribute("href") || "", // Don't use href property because it contains a complete URL including a domain.
            openInNewTab: selectedLink.target === "_blank",
        };

        if (linkDescriptor.linkUrl.startsWith("http")) {
            this.kenticoLinkPlugin.showConfigureExternalLinkPopup(relatedElementPosition, linkDescriptor, DialogMode.UPDATE)
        } else {
            this.kenticoLinkPlugin.showConfigurePageLinkPopup(relatedElementPosition, linkDescriptor, DialogMode.UPDATE);
        }
    }
}, editPageLinkIcon);

// Open path tab command
const openPathTabCommandIcon = new FroalaIcon(constants.SWITCH_PATH_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "insertLink" });
const openPathTabCommand = new FroalaCommand(constants.SWITCH_PATH_TAB_COMMAND_NAME, {
    title: getString("Command.PathTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, LinkType.PAGE, DialogMode.INSERT);
    }
}, openPathTabCommandIcon);

// Open external link tab command
const openExternalLinkTabCommandIcon = new FroalaIcon(constants.SWITCH_EXTERNAL_LINK_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "openLink" });
const openExternalLinkTabCommand = new FroalaCommand(constants.SWITCH_EXTERNAL_LINK_TAB_COMMAND_NAME, {
    title: getString("Command.ExternalLinkTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, LinkType.EXTERNAL, DialogMode.INSERT);
    }
}, openExternalLinkTabCommandIcon);

export const linkCommands = [
    openInsertLinkPopupCommand,
    closeLinkConfigurationPopupCommand,
    insertPageLinkCommand,
    editPageLinkCommand,
    updatePageLinkCommand,
    openPathTabCommand,
    openExternalLinkTabCommand
]
