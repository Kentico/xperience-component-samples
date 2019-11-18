import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";

import * as constants from "./link-constants";

import { FroalaCommand } from "../../froala-command";
import { FroalaIcon } from "../../froala-icon";
import { getString } from "./link-helpers";
import { getDialogElement } from "../popup-helper";
import { LinkType } from "./link-types";
import { showForm } from "./popups/link-configuration-popup";
import { LinkModel } from "./link-model";
import { LinkDescriptor } from "./link-descriptor";

let selectedLink: HTMLAnchorElement;
let defaultLinkDescriptor: LinkDescriptor;

// Open insert link popup

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
        defaultLinkDescriptor = new LinkDescriptor(linkText);
        this.kenticoLinkPlugin.showInsertLinkPopup(this.position.getBoundingRect(), defaultLinkDescriptor);
    }
}, openInsertLinkPopupCommandIcon);

// Close link configuration popup

const closeLinkConfigurationPopupCommandIcon = new FroalaIcon(constants.CLOSE_LINK_CONFIGURATION_POPUP_COMMAND_NAME, { NAME: "arrow-left", SVG_KEY: "back" });
const closeLinkConfigurationPopupCommand = new FroalaCommand(constants.CLOSE_LINK_CONFIGURATION_POPUP_COMMAND_NAME, {
    title: getString("Command.Back"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        this.kenticoLinkPlugin.hideLinkConfigurationPopup();
    }
}, closeLinkConfigurationPopupCommandIcon);

// Insert link

const insertLinkCommandParameters: RegisterCommandParameters = {
    title: "",
    undo: true,
    focus: false,
    callback(this: FroalaEditor, command: string) {
        const isGeneralLink = command === constants.INSERT_GENERAL_LINK_COMMAND_NAME;
        const link = getLinkData(this, constants.INSERT_LINK_POPUP_NAME, isGeneralLink);

        if (!link) {
            this.kenticoLinkPlugin.hideLinkConfigurationPopup();
            return;
        }

        this.undo.saveStep();

        this.link.insert(link.linkURL, link.linkText, link.openInNewTab ? { target: "_blank" } : undefined);
        this.kenticoLinkPlugin.hideLinkConfigurationPopup();
    }
}

const insertPageLinkCommand = new FroalaCommand(constants.INSERT_PAGE_LINK_COMMAND_NAME, insertLinkCommandParameters);
const insertGeneralLinkCommand = new FroalaCommand(constants.INSERT_GENERAL_LINK_COMMAND_NAME, insertLinkCommandParameters);

// Update link

const updateLinkCommandParameters: RegisterCommandParameters = {
    title: "",
    undo: true,
    focus: false,
    callback(this: FroalaEditor, command: string) {
        const isGeneralLink = command === constants.UPDATE_GENERAL_LINK_COMMAND_NAME;
        const popupName = isGeneralLink ? constants.CONFIGURE_GENERAL_LINK_POPUP_NAME : constants.CONFIGURE_PAGE_LINK_POPUP_NAME;
        const link = getLinkData(this, popupName, isGeneralLink);

        if (!link) {
            this.kenticoLinkPlugin.hideLinkConfigurationPopup();
            return;
        }

        if (selectedLink) {
            this.undo.saveStep();
            selectedLink.setAttribute("href", link.linkURL);
            selectedLink.innerText = link.linkText;

            if (link.openInNewTab) {
                selectedLink.setAttribute("target", "_blank");
            }
            else {
                selectedLink.removeAttribute("target");
            }
        }

        this.kenticoLinkPlugin.hideLinkConfigurationPopup();
    }
};

const updatePageLinkCommand = new FroalaCommand(constants.UPDATE_PAGE_LINK_COMMAND_NAME, updateLinkCommandParameters);
const updateGeneralLinkCommand = new FroalaCommand(constants.UPDATE_GENERAL_LINK_COMMAND_NAME, updateLinkCommandParameters);

// Open link configuration popup

const openLinkConfigurationPopupCommandIcon = new FroalaIcon(constants.OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, { NAME: "edit", SVG_KEY: "editLink" });
const openLinkConfigurationPopupCommand = new FroalaCommand(constants.OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, {
    title: getString("Command.EditLink"),
    undo: false,
    focus: false,
    async callback(this: FroalaEditor) {
        selectedLink = this.link.get() as HTMLAnchorElement;
        const relatedElementPosition = this.position.getBoundingRect();
        await this.kenticoLinkPlugin.showLinkConfigurationPopup(relatedElementPosition, new LinkDescriptor(selectedLink));
    }
}, openLinkConfigurationPopupCommandIcon);

// Switch page link tab command

const switchPageLinkTabCommandIcon = new FroalaIcon(constants.SWITCH_PAGE_LINK_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "insertLink" });
const switchPageLinkTabCommand = new FroalaCommand(constants.SWITCH_PAGE_LINK_TAB_COMMAND_NAME, {
    title: getString("Command.PageLinkTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, new LinkModel(LinkType.PAGE));
    }
}, switchPageLinkTabCommandIcon);

// Switch general link tab command

const switchGeneralLinkTabCommandIcon = new FroalaIcon(constants.SWITCH_GENERAL_LINK_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "openLink" });
const switchGeneralLinkTabCommand = new FroalaCommand(constants.SWITCH_GENERAL_LINK_TAB_COMMAND_NAME, {
    title: getString("Command.GeneralLinkTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, new LinkModel(LinkType.EXTERNAL));
    }
}, switchGeneralLinkTabCommandIcon);

const getLinkData = (editor: FroalaEditor, popupName: string, isGeneralLink: boolean): LinkDescriptor | null => {
    const popupElement = getDialogElement(editor, popupName);
    if (!popupElement) {
        return null;
    }

    let link = extractFormData(popupElement);

    if (!link.linkURL) {
        return null;
    }
    if (!link.linkText) {
        const linkText = isGeneralLink ? link.linkURL : popupElement.querySelector<HTMLElement>(".ktc-page-name")!.innerText;

        link = new LinkDescriptor(linkText, link.linkURL, link.openInNewTab);
    }

    return link;
}

const extractFormData = (popupElement: HTMLElement): LinkDescriptor => {
    const form = popupElement.querySelector<HTMLFormElement>("#ktc-form");
    const formData = new FormData(form!);

    return {
        linkURL: formData.get("linkUrl") as string,
        linkText: formData.get("linkText") as string,
        openInNewTab: Boolean(formData.get("openInNewTab")),
    }
}

export const linkCommands = [
    openInsertLinkPopupCommand,
    openLinkConfigurationPopupCommand,
    closeLinkConfigurationPopupCommand,
    insertPageLinkCommand,
    insertGeneralLinkCommand,
    updatePageLinkCommand,
    updateGeneralLinkCommand,
    switchPageLinkTabCommand,
    switchGeneralLinkTabCommand
]
