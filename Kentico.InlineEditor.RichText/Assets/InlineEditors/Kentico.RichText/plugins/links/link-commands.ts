import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";

import * as constants from "./link-constants";
import { FroalaCommand } from "../../froala-command";
import { FroalaIcon } from "../../froala-icon";
import { getString, getLinkModel } from "./link-helpers";
import { getDialogElement } from "../popup-helper";
import { LinkType } from "./link-types";
import { showForm } from "./popups/link-configuration-popup";
import { LinkModel } from "./link-model";
import { LinkDescriptor } from "./link-descriptor";
import { IdentifierMode } from "@/types/kentico/selectors/page-selector-open-options";
import { MediaFile } from "@/types/kentico/selectors/media-file";
import { Page } from "@/types/kentico/selectors/page";

type OpenItemSelectionCommand = typeof constants.OPEN_PAGE_SELECTION_DIALOG_COMMAND_NAME | typeof constants.OPEN_MEDIA_FILE_SELECTION_DIALOG_COMMAND_NAME;

let defaultLinkDescriptor: LinkDescriptor;
let linkModel: LinkModel;

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
        linkModel = new LinkModel(LinkType.PAGE);
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
        const link = getLinkData(this, isGeneralLink);

        if (!link) {
            this.kenticoLinkPlugin.hideLinkConfigurationPopup();
            return;
        }

        this.link.insert(link.linkURL, link.linkText, link.openInNewTab ? { target: "_blank" } : undefined);
        this.kenticoLinkPlugin.hideLinkConfigurationPopup();
    }
}

const insertPageLinkCommand = new FroalaCommand(constants.INSERT_PAGE_LINK_COMMAND_NAME, insertLinkCommandParameters);
const insertGeneralLinkCommand = new FroalaCommand(constants.INSERT_GENERAL_LINK_COMMAND_NAME, insertLinkCommandParameters);
const insertMediaLinkCommand = new FroalaCommand(constants.INSERT_MEDIA_LINK_COMMAND_NAME, insertLinkCommandParameters);

// Open link configuration popup

const openLinkConfigurationPopupCommandIcon = new FroalaIcon(constants.OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, { NAME: "edit", SVG_KEY: "editLink" });
const openLinkConfigurationPopupCommand = new FroalaCommand(constants.OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, {
    title: getString("Command.EditLink"),
    undo: false,
    focus: false,
    async callback(this: FroalaEditor) {
        const link = this.link.get() as HTMLAnchorElement;
        const linkDescriptor = new LinkDescriptor(link);
        const relatedElementPosition = this.position.getBoundingRect();

        const getLinkMetadataEndpointUrl = this.opts.getLinkMetadataEndpointUrl;
        linkModel = await getLinkModel(getLinkMetadataEndpointUrl, linkDescriptor.linkURL);
        await this.kenticoLinkPlugin.showLinkConfigurationPopup(relatedElementPosition, linkDescriptor, linkModel);
    }
}, openLinkConfigurationPopupCommandIcon);

// Switch page link tab command

const switchPageLinkTabCommandIcon = new FroalaIcon(constants.SWITCH_PAGE_LINK_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "insertLink" });
const switchPageLinkTabCommand = new FroalaCommand(constants.SWITCH_PAGE_LINK_TAB_COMMAND_NAME, {
    title: getString("Command.PageLinkTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        linkModel = new LinkModel(LinkType.PAGE);
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, linkModel);
    }
}, switchPageLinkTabCommandIcon);

// Switch general link tab command

const switchGeneralLinkTabCommandIcon = new FroalaIcon(constants.SWITCH_GENERAL_LINK_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "openLink" });
const switchGeneralLinkTabCommand = new FroalaCommand(constants.SWITCH_GENERAL_LINK_TAB_COMMAND_NAME, {
    title: getString("Command.GeneralLinkTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        linkModel = new LinkModel(LinkType.EXTERNAL);
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, linkModel);
    }
}, switchGeneralLinkTabCommandIcon);

// Switch media link tab command

const switchMediaLinkTabCommandIcon = new FroalaIcon(constants.SWITCH_MEDIA_LINK_TAB_COMMAND_NAME, { NAME: "link", SVG_KEY: "insertImage" });
const switchMediaLinkTabCommand = new FroalaCommand(constants.SWITCH_MEDIA_LINK_TAB_COMMAND_NAME, {
    title: getString("Command.MediaLinkTab"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        linkModel = new LinkModel(LinkType.MEDIA);
        showForm(this, constants.INSERT_LINK_POPUP_NAME, defaultLinkDescriptor, linkModel);
    }
}, switchMediaLinkTabCommandIcon);

const getItemSelectionCommandParameters = (commandName: OpenItemSelectionCommand): RegisterCommandParameters => ({
    title: "",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        const modalDialog = window.kentico.modalDialog;
        const selector = commandName === constants.OPEN_PAGE_SELECTION_DIALOG_COMMAND_NAME ?
            modalDialog.pageSelector :
            modalDialog.mediaFilesSelector;

        const popupName = getVisiblePopupName(this);
        const popup = getDialogElement(this, popupName!);
        const link = this.link.get() as HTMLAnchorElement;
        const linkDescriptor = new LinkDescriptor(link ? link.text : this.selection.text());

        if (!popup) {
            return;
        }

        const options: any = {
            applyCallback(items: Page[] | MediaFile[]) {
                if (items && items.length) {
                    handleItemSelection(commandName, items[0], popup, linkDescriptor);
                }
            }
        };

        const preselectedItemIdentifier = linkModel?.linkMetadata?.identifier;
        if (preselectedItemIdentifier) {
            options.selectedValues = commandName === constants.OPEN_PAGE_SELECTION_DIALOG_COMMAND_NAME ?
                [{ identifier: preselectedItemIdentifier }] :
                [{ fileGuid: preselectedItemIdentifier }];
        }

        if (commandName === constants.OPEN_PAGE_SELECTION_DIALOG_COMMAND_NAME) {
            options.identifierMode = IdentifierMode.Guid;
        } else {
            options.allowedExtensions = `.${this.opts.imageAllowedTypes.join(";.")}`;
        }

        selector.open(options);
    }
})

// Open media file selection dialog
const openPageSelectionDialogCommand = new FroalaCommand(constants.OPEN_PAGE_SELECTION_DIALOG_COMMAND_NAME, getItemSelectionCommandParameters(constants.OPEN_PAGE_SELECTION_DIALOG_COMMAND_NAME));
const openMediaFileSelectionDialogCommand = new FroalaCommand(constants.OPEN_MEDIA_FILE_SELECTION_DIALOG_COMMAND_NAME, getItemSelectionCommandParameters(constants.OPEN_MEDIA_FILE_SELECTION_DIALOG_COMMAND_NAME))

const handleItemSelection = (commandName: string, selectedItem: Page | MediaFile, popup: HTMLElement, linkDescriptor: LinkDescriptor) => {
    if (commandName === constants.OPEN_PAGE_SELECTION_DIALOG_COMMAND_NAME) {
        const { name, nodeGuid, url } = selectedItem as Page;
        updateSelectedItem(popup, linkDescriptor, name, url, nodeGuid);
    } else {
        const { url, name, fileGuid, extension } = selectedItem as MediaFile;
        const mediaFileNameWithExtension = extension ? name + extension : name;
        updateSelectedItem(popup, linkDescriptor, mediaFileNameWithExtension, url, fileGuid);
    }
}

const updateSelectedItem = (popup: HTMLElement, linkDescriptor: LinkDescriptor, itemName: string, itemUrl: string, itemIdentifier: string) => {
    const selector = popup.querySelector<HTMLElement>(".ktc-selector")!;
    const selectorItem = selector.querySelector<HTMLLabelElement>(".ktc-selector-item")!;
    const selectorButton = selector.querySelector<HTMLButtonElement>(".ktc-selector-btn")!;

    const urlField = popup.querySelector<HTMLInputElement>("input[name='linkUrl']")!;
    const linkText = popup.querySelector<HTMLInputElement>("input[name='linkText']");

    urlField.value = itemUrl;
    selectorItem.textContent = selectorItem.title = itemName;
    selectorButton.textContent = getString("ActionButton.ChangeMedia");

    if (linkText && !linkText.value) {
        linkText.value = itemName;
        linkText.classList.add("fr-not-empty");
    }

    linkModel = new LinkModel(LinkType.MEDIA, linkDescriptor.linkURL, {
        name: itemName,
        identifier: itemIdentifier,
    });

    selector.classList.remove("ktc-selector--empty");
}

const getLinkData = (editor: FroalaEditor, isGeneralLink: boolean): LinkDescriptor | null => {
    const popupName = getVisiblePopupName(editor);
    const popupElement = getDialogElement(editor, popupName!);
    if (!popupElement) {
        return null;
    }

    let link = extractFormData(popupElement);

    if (!link.linkURL) {
        return null;
    }
    if (!link.linkText) {
        const linkText = isGeneralLink ? link.linkURL : popupElement.querySelector<HTMLElement>(".ktc-page-name, .ktc-media-name")!.innerText;

        link = new LinkDescriptor(linkText, link.linkURL, link.openInNewTab);
    }

    return link;
}

const extractFormData = (popupElement: HTMLElement): LinkDescriptor => {
    const form = popupElement.querySelector<HTMLFormElement>("#ktc-link-popup-form");
    const formData = new FormData(form!);

    return {
        linkURL: formData.get("linkUrl") as string,
        linkText: formData.get("linkText") as string,
        openInNewTab: Boolean(formData.get("openInNewTab")),
    }
}

const getVisiblePopupName = (editor: FroalaEditor) => {
    if (editor.popups.isVisible(constants.INSERT_LINK_POPUP_NAME)) {
        return constants.INSERT_LINK_POPUP_NAME;
    } else if (editor.popups.isVisible(constants.CONFIGURE_PAGE_LINK_POPUP_NAME)) {
        return constants.CONFIGURE_PAGE_LINK_POPUP_NAME;
    } else if (editor.popups.isVisible(constants.CONFIGURE_GENERAL_LINK_POPUP_NAME)) {
        return constants.CONFIGURE_GENERAL_LINK_POPUP_NAME;
    } else if (editor.popups.isVisible(constants.CONFIGURE_MEDIA_LINK_POPUP_NAME)) {
        return constants.CONFIGURE_MEDIA_LINK_POPUP_NAME;
    }
}

export const linkCommands = [
    openInsertLinkPopupCommand,
    openLinkConfigurationPopupCommand,
    closeLinkConfigurationPopupCommand,
    insertPageLinkCommand,
    insertGeneralLinkCommand,
    insertMediaLinkCommand,
    switchPageLinkTabCommand,
    switchGeneralLinkTabCommand,
    switchMediaLinkTabCommand,
    openPageSelectionDialogCommand,
    openMediaFileSelectionDialogCommand,
]
