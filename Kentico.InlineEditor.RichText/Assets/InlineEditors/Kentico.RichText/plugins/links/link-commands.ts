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
import { PageSelectorOpenOptions, IdentifierMode } from "@/types/kentico/selectors/page-selector-open-options";
import { MediaFilesSelectorOpenOptions } from "@/types/kentico/selectors/media-files-selector-open-options";

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

// Open page selection dialog

const openPageSelectionDialogCommand = new FroalaCommand(constants.OPEN_PAGE_SELECTION_DIALOG_COMMAND_NAME, {
    title: "",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        const popupName = getVisiblePopupName(this);
        const link = this.link.get() as HTMLAnchorElement;
        const linkDescriptor = new LinkDescriptor(link ? link.text : this.selection.text());
        const popup = getDialogElement(this, popupName!);

        const pageSelector = popup!.querySelector<HTMLElement>(".ktc-page-selector");
        const pageSelectButton = popup!.querySelector<HTMLButtonElement>(".ktc-page-selection");

        const selectedPageIdentifier = linkModel?.linkMetadata?.identifier;
        let options: PageSelectorOpenOptions = {
            identifierMode: IdentifierMode.Guid,
            applyCallback(selectedPages) {
                if (selectedPages && selectedPages.length) {
                    const pageNameField = popup!.querySelector<HTMLLabelElement>(".ktc-page-name")!;
                    const pageUrlField = popup!.querySelector<HTMLInputElement>("input[name='linkUrl']");
                    const { name, nodeGuid, url } = selectedPages[0];
                    const linkText = popup!.querySelector<HTMLInputElement>("input[name='linkText']");

                    pageNameField.textContent = pageNameField.title = name;
                    pageUrlField!.value = url;
                    pageSelectButton!.textContent = getString("ActionButton.ChangePage");

                    // Update page metadata to make them available next time the page selector is opened.
                    linkModel = new LinkModel(LinkType.PAGE, linkDescriptor.linkURL, {
                        name,
                        identifier: nodeGuid,
                    });

                    if (linkText && !linkText.value) {
                        linkText.value = name;
                        linkText.classList.add("fr-not-empty");
                    }

                    pageSelector!.classList.remove("ktc-page-selector--empty");
                }
            }
        };

        if (selectedPageIdentifier) {
            options = {
                ...options,
                selectedValues: [{ identifier: selectedPageIdentifier }],
            }
        }

        window.kentico.modalDialog.pageSelector.open(options);
    }
});

// Open media file selection dialog

const openMediaFileSelectionDialogCommand = new FroalaCommand(constants.OPEN_MEDIA_FILE_SELECTION_DIALOG_COMMAND_NAME, {
    title: "",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        const popupName = getVisiblePopupName(this);
        const popup = getDialogElement(this, popupName!);
        const link = this.link.get() as HTMLAnchorElement;
        const linkDescriptor = new LinkDescriptor(link ? link.text : this.selection.text());

        if (!popup) {
            return;
        }

        const mediaSelector = popup.querySelector<HTMLElement>(".ktc-media-selector");
        const mediaSelectButton = popup.querySelector<HTMLButtonElement>(".ktc-media-selection");

        const selectedMediaIdentifier = linkModel?.linkMetadata?.identifier;
        let options: MediaFilesSelectorOpenOptions = {
            allowedExtensions: `.${this.opts.imageAllowedTypes.join(";.")}`,
            applyCallback(images) {
                if (images && images[0]) {
                    const { url, name, fileGuid } = images[0];
                    const mediaUrlField = popup.querySelector<HTMLInputElement>("input[name='linkUrl']");
                    const mediaNameLabel = popup.querySelector<HTMLLabelElement>(".ktc-media-name")!;
                    const mediaLinkText = popup.querySelector<HTMLInputElement>("input[name='linkText']");
                    mediaUrlField!.value = url;
                    mediaNameLabel!.textContent = mediaNameLabel!.title = name;
                    mediaSelectButton!.textContent = getString("ActionButton.ChangeMedia");

                    if (mediaLinkText && !mediaLinkText.value) {
                        mediaLinkText.value = name;
                        mediaLinkText.classList.add("fr-not-empty");
                    }

                    linkModel = new LinkModel(LinkType.MEDIA, linkDescriptor.linkURL, {
                        name,
                        identifier: fileGuid,
                    });

                    mediaSelector!.classList.remove("ktc-media-selector--empty");
                }
            }
        };

        if (selectedMediaIdentifier) {
            options = {
                ...options,
                selectedValues: [{ fileGuid: selectedMediaIdentifier }],
            }
        }

        window.kentico.modalDialog.mediaFilesSelector.open(options);
    }
});

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
