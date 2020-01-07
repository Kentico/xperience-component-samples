import FroalaEditor, { Image } from "froala-editor/js/froala_editor.pkgd.min";

import { showPopup, getDialogElement, bindFocusEventToInputs } from "../../popup-helper";
import { INSERT_LINK_POPUP_NAME, CONFIGURE_PAGE_LINK_POPUP_NAME, SWITCH_PAGE_LINK_TAB_COMMAND_NAME, SWITCH_GENERAL_LINK_TAB_COMMAND_NAME, CONFIGURE_GENERAL_LINK_POPUP_NAME, SWITCH_MEDIA_LINK_TAB_COMMAND_NAME } from "../link-constants";
import { getPageLinkConfigurationPopupTemplate, getGeneralLinkConfigurationPopupTemplate, getMediaLinkConfigurationPopupTemplate } from "../link-templates";
import { DialogMode } from "../../plugin-types";
import { getString, getLinkModel } from "../link-helpers";
import { LinkType } from "../link-types";
import { LinkModel } from "../link-model";
import { LinkDescriptor } from "../link-descriptor";

import { IdentifierMode, PageSelectorOpenOptions } from "@/types/kentico/selectors/page-selector-open-options";
import { MediaFilesSelectorOpenOptions } from "@/types/kentico/selectors/media-files-selector-open-options";

const POPUP_TEMPLATE_BODY_CLASS_NAME = "ktc-configure-popup";

const getShowLinkPopup = (popupName: string, buttons: any[], linkModel: LinkModel) =>
    (editor: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor, dialogMode: DialogMode = DialogMode.INSERT) => {
        const customLayer = `<div class="${POPUP_TEMPLATE_BODY_CLASS_NAME}"></div>`;
        showPopup(editor, popupName, relatedElementPosition, buttons, customLayer);
        showForm(editor, popupName, linkDescriptor, linkModel, dialogMode);
    }

export async function showInsertLinkPopup(this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) {
    getShowLinkPopup(INSERT_LINK_POPUP_NAME, this.opts.popupInsertLinkButtons, new LinkModel(LinkType.PAGE))(this, relatedElementPosition, linkDescriptor);
}

export async function showLinkConfigurationPopup(this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) {
    const getLinkMetadataEndpointUrl = this.opts.getLinkMetadataEndpointUrl;
    const linkModel = await getLinkModel(getLinkMetadataEndpointUrl, linkDescriptor.linkURL);

    const showLinkPopup = linkModel.linkType === LinkType.PAGE
        ? getShowLinkPopup(CONFIGURE_PAGE_LINK_POPUP_NAME, this.opts.popupUpdatePageLinkButtons, linkModel)
        : getShowLinkPopup(CONFIGURE_GENERAL_LINK_POPUP_NAME, this.opts.popupUpdateGeneralLinkButtons, linkModel);
    showLinkPopup(this, relatedElementPosition, linkDescriptor, DialogMode.UPDATE);
}

export const showForm = (editor: FroalaEditor, popupName: string, linkDescriptor: LinkDescriptor, linkModel: LinkModel, dialogMode: DialogMode = DialogMode.INSERT) => {
    const dialog = getDialogElement(editor, popupName);

    if (!dialog) {
        return;
    }

    const { linkType } = linkModel;
    const container = dialog.querySelector<HTMLElement>(`.${POPUP_TEMPLATE_BODY_CLASS_NAME}`);
    const tabCommand =
        linkType === LinkType.PAGE
            ? SWITCH_PAGE_LINK_TAB_COMMAND_NAME
            : linkType === LinkType.MEDIA
                ? SWITCH_MEDIA_LINK_TAB_COMMAND_NAME
                : SWITCH_GENERAL_LINK_TAB_COMMAND_NAME;

    if (!container) {
        return;
    }

    switch (linkType) {
        case LinkType.PAGE:
            showPageLinkForm(container, linkModel, linkDescriptor, dialogMode);
            break;

        case LinkType.LOCAL:
            const { linkText, openInNewTab } = linkDescriptor;
            const descriptor = new LinkDescriptor(linkText, linkModel.linkURL!, openInNewTab);
            container.innerHTML = getGeneralLinkConfigurationPopupTemplate(descriptor, dialogMode);
            break;

        case LinkType.EXTERNAL:
            container.innerHTML = getGeneralLinkConfigurationPopupTemplate(linkDescriptor, dialogMode);
            break;

        case LinkType.MEDIA:
            const { opts, image } = editor;
            showMediaLinkForm(container, linkModel, linkDescriptor, dialogMode, opts.imageAllowedTypes, image);
            break;

        default:
            break;
    }

    const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
    button!.classList.add("fr-active", "fr-selected");

    bindFocusEventToInputs(dialog);

    if (linkType !== LinkType.PAGE) {
        const popup = editor.popups.get(popupName);
        editor.accessibility.focusPopup(popup);
    }
}

export function hideLinkConfigurationPopup(this: FroalaEditor) {
    this.popups.hide(INSERT_LINK_POPUP_NAME);
    this.popups.hide(CONFIGURE_PAGE_LINK_POPUP_NAME);
    this.popups.hide(CONFIGURE_GENERAL_LINK_POPUP_NAME);
}

const showPageLinkForm = async (container: HTMLElement, linkModel: LinkModel, linkDescriptor: LinkDescriptor, dialogMode: DialogMode) => {
    let pageName = linkModel.linkMetadata && linkModel.linkMetadata.name;
    container.innerHTML = getPageLinkConfigurationPopupTemplate(pageName, linkDescriptor, dialogMode);

    const pageSelector = container!.querySelector<HTMLElement>(".ktc-page-selector");
    const pageSelectButton = container!.querySelector<HTMLButtonElement>(".ktc-page-selection");

    pageSelectButton!.addEventListener("click", () => {
        const selectedPageIdentifier = linkModel.linkMetadata && linkModel.linkMetadata.identifier;
        let options: PageSelectorOpenOptions = {
            identifierMode: IdentifierMode.Guid,
            applyCallback(selectedPages) {
                if (selectedPages && selectedPages.length) {
                    const pageNameField = container!.querySelector<HTMLLabelElement>(".ktc-page-name")!;
                    const pageUrlField = container!.querySelector<HTMLInputElement>("input[name='linkUrl']");
                    const { name, nodeGuid, url } = selectedPages[0];
                    const linkText = container!.querySelector<HTMLInputElement>("input[name='linkText']");

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
    });
}

const showMediaLinkForm = (container: HTMLElement, linkModel: LinkModel, linkDescriptor: LinkDescriptor, dialogMode: DialogMode, allowedExtensions: string[], image: Image) => {

    if (!container) {
        return;
    }

    const mediaName = linkModel.linkMetadata && linkModel.linkMetadata.name;
    container.innerHTML = getMediaLinkConfigurationPopupTemplate(mediaName, linkDescriptor, dialogMode);

    const mediaSelector = container!.querySelector<HTMLElement>(".ktc-media-selector");
    const mediaSelectButton = container!.querySelector<HTMLButtonElement>(".ktc-media-selection");

    mediaSelectButton!.addEventListener("click", () => {
        const selectedMediaIdentifier = linkModel.linkMetadata && linkModel.linkMetadata.identifier;
        
        let options: MediaFilesSelectorOpenOptions = {
            allowedExtensions: `.${allowedExtensions.join(";.")}`,
            applyCallback(images) {
                if (images && images[0]) {
                    const { url, title, name, fileGuid } = images[0];
                    const mediaUrlField = container.querySelector<HTMLInputElement>("input[name='mediaUrl']");
                    const mediaNameLabel = container.querySelector<HTMLLabelElement>(".ktc-media-name")!;
                    const mediaLinkText = container!.querySelector<HTMLInputElement>("input[name='mediaLinkText']");
                    mediaUrlField!.value = url;
                    mediaNameLabel!.textContent = mediaNameLabel!.title = name;
                    mediaSelectButton!.textContent = getString("ActionButton.ChangeMedia");
                    // TODO: MAE-194 <a><img .../></a>
                    // image.insert(selectedImage.url, true, { name: selectedImage.name, id: selectedImage.fileGuid });

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
    });
}
