import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";

import * as constants from "./link-constants";

import { FroalaCommand } from "../../froala-command";
import { FroalaIcon } from "../../froala-icon";
import { getString } from "./link-helpers";
import { getDialogElement } from "../popup-helper";
import { LinkDescriptor, LinkType, LinkInfo } from "./link-types";
import { showForm } from "./popups/link-configuration-popup";

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
        defaultLinkDescriptor = {
            linkText: (linkText.trim().length === 0) ? "" : linkText,
            linkUrl: "",
            openInNewTab: false
        };
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
        const isExternalLink = command === constants.INSERT_EXTERNAL_LINK_COMMAND_NAME;
        const link = getLinkData(this, constants.INSERT_LINK_POPUP_NAME, isExternalLink);

        if (!link) {
            this.kenticoLinkPlugin.hideLinkConfigurationPopup();
            return;
        }

        this.undo.saveStep();

        this.link.insert(link.linkUrl, link.linkText, link.openInNewTab ? { target: "_blank" } : undefined);
        this.kenticoLinkPlugin.hideLinkConfigurationPopup();
    }
}

const insertPageLinkCommand = new FroalaCommand(constants.INSERT_PAGE_LINK_COMMAND_NAME, insertLinkCommandParameters);
const insertExternalLinkCommand = new FroalaCommand(constants.INSERT_EXTERNAL_LINK_COMMAND_NAME, insertLinkCommandParameters);

// Update link

const updateLinkCommandParameters: RegisterCommandParameters = {
    title: "",
    undo: true,
    focus: false,
    callback(this: FroalaEditor, command: string) {
        const isExternalLink = command !== constants.UPDATE_PAGE_LINK_COMMAND_NAME;
        const popupName = isExternalLink ? constants.CONFIGURE_EXTERNAL_LINK_POPUP_NAME : constants.CONFIGURE_PAGE_LINK_POPUP_NAME;
        const link = getLinkData(this, popupName, isExternalLink);

        if (!link) {
            this.kenticoLinkPlugin.hideLinkConfigurationPopup();
            return;
        }

        if (selectedLink) {
            this.undo.saveStep();
            selectedLink.setAttribute("href", link.linkUrl);
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
const updateExternalLinkCommand = new FroalaCommand(constants.UPDATE_EXTERNAL_LINK_COMMAND_NAME, updateLinkCommandParameters);

// Open link configuration popup

const openLinkConfigurationPopupCommandIcon = new FroalaIcon(constants.OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, { NAME: "edit", SVG_KEY: "editLink" });
const openLinkConfigurationPopupCommand = new FroalaCommand(constants.OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, {
    title: getString("Command.EditLink"),
    undo: false,
    focus: false,
    async callback(this: FroalaEditor) {
        selectedLink = this.link.get() as HTMLAnchorElement;
        const relatedElementPosition = this.position.getBoundingRect();
        const linkDescriptor: LinkDescriptor = {
            linkText: selectedLink.text,
            linkUrl: selectedLink.getAttribute("href") || "", // Don't use href property because it contains a complete URL including a domain.
            openInNewTab: selectedLink.target === "_blank",
        };

        await this.kenticoLinkPlugin.showLinkConfigurationPopup(relatedElementPosition, linkDescriptor);
    }
}, openLinkConfigurationPopupCommandIcon);

// Switch page link tab command

const switchPageLinkTabCommandIcon = new FroalaIcon(constants.SWITCH_PAGE_LINK_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "insertLink" });
const switchPageLinkTabCommand = new FroalaCommand(constants.SWITCH_PAGE_LINK_TAB_COMMAND_NAME, {
    title: getString("Command.PageLinkTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        const linkInfo: LinkInfo = {
            linkType: LinkType.PAGE,
            linkMetadata: {
                name: "",
                identifier: "",
            },
        };
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, linkInfo);
    }
}, switchPageLinkTabCommandIcon);

// Switch external link tab command

const switchExternalLinkTabCommandIcon = new FroalaIcon(constants.SWITCH_EXTERNAL_LINK_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "openLink" });
const switchExternalLinkTabCommand = new FroalaCommand(constants.SWITCH_EXTERNAL_LINK_TAB_COMMAND_NAME, {
    title: getString("Command.ExternalLinkTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        const linkInfo: LinkInfo = {
            linkType: LinkType.EXTERNAL,
            linkMetadata: {
                name: "",
                identifier: "",
            },
        };
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, linkInfo);
    }
}, switchExternalLinkTabCommandIcon);

const getLinkData = (editor: FroalaEditor, popupName: string, isExternalLink: boolean): LinkDescriptor | null => {
    const popupElement = getDialogElement(editor, popupName);
    if (!popupElement) {
        return null;
    }

    let link = extractFormData(popupElement);

    if (!link.linkUrl) {
        return null;
    }
    if (!link.linkText) {
        const linkText = isExternalLink ? link.linkUrl : popupElement.querySelector<HTMLElement>(".ktc-page-name")!.innerText;

        link = {
            ...link,
            linkText,
        };
    }

    return link;
}

const extractFormData = (popupElement: HTMLElement): LinkDescriptor => {
    const form = popupElement.querySelector<HTMLFormElement>("#ktc-form");
    const formData = new FormData(form!);

    return {
        linkUrl: formData.get("linkUrl") as string,
        linkText: formData.get("linkText") as string,
        openInNewTab: Boolean(formData.get("openInNewTab")),
    }
}

export const linkCommands = [
    openInsertLinkPopupCommand,
    openLinkConfigurationPopupCommand,
    closeLinkConfigurationPopupCommand,
    insertPageLinkCommand,
    insertExternalLinkCommand,
    updatePageLinkCommand,
    updateExternalLinkCommand,
    switchPageLinkTabCommand,
    switchExternalLinkTabCommand
]
