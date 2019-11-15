import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { showPopup, getDialogElement, bindFocusEventToInputs } from "../../popup-helper";
import { INSERT_LINK_POPUP_NAME, CONFIGURE_PAGE_LINK_POPUP_NAME, SWITCH_PAGE_LINK_TAB_COMMAND_NAME, SWITCH_EXTERNAL_LINK_TAB_COMMAND_NAME, CONFIGURE_EXTERNAL_LINK_POPUP_NAME } from "../link-constants";
import { getPageLinkConfigurationPopupTemplate, getExternalLinkConfigurationPopupTemplate } from "../link-templates";
import { DialogMode } from "../../plugin-types";
import { getString, getLinkInfo } from "../link-helpers";
import { LinkDescriptor, LinkType, LinkInfo } from "../link-types";
import { IdentifierMode } from "@/types/kentico/selectors/page-selector-open-options";

const POPUP_TEMPLATE_BODY_CLASS_NAME = "ktc-configure-popup";

const getShowLinkPopup = (popupName: string, buttons: any[], linkInfo: LinkInfo) =>
    (editor: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor, dialogMode: DialogMode = DialogMode.INSERT) => {
        const customLayer = `<div class="${POPUP_TEMPLATE_BODY_CLASS_NAME}"></div>`;
        showPopup(editor, popupName, relatedElementPosition, buttons, customLayer);
        showForm(editor, popupName, linkDescriptor, linkInfo, dialogMode);
    }

export async function showInsertLinkPopup(this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) {
    const linkInfo: LinkInfo = {
        linkType: LinkType.PAGE,
        linkMetadata: {
            name: "",
            identifier: "",
        },
    };
    getShowLinkPopup(INSERT_LINK_POPUP_NAME, this.opts.popupInsertLinkButtons, linkInfo)(this, relatedElementPosition, linkDescriptor);
}

export async function showLinkConfigurationPopup(this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) {
    const getLinkMetadataEndpointUrl = this.opts.getLinkMetadataEndpointUrl;
    const linkMetadata = await getLinkInfo(getLinkMetadataEndpointUrl, linkDescriptor.linkUrl);

    const showLinkPopup = linkMetadata.linkType === LinkType.PAGE
        ? getShowLinkPopup(CONFIGURE_PAGE_LINK_POPUP_NAME, this.opts.popupUpdatePageLinkButtons, linkMetadata)
        : getShowLinkPopup(CONFIGURE_EXTERNAL_LINK_POPUP_NAME, this.opts.popupUpdateExternalLinkButtons, linkMetadata);
    showLinkPopup(this, relatedElementPosition, linkDescriptor, DialogMode.UPDATE);
}

export const showForm = (editor: FroalaEditor, popupName: string, linkDescriptor: LinkDescriptor, linkInfo: LinkInfo, dialogMode: DialogMode = DialogMode.INSERT) => {
    const dialog = getDialogElement(editor, popupName);

    if (!dialog) {
        return;
    }
    
    const { linkType } = linkInfo;
    const container = dialog.querySelector<HTMLElement>(`.${POPUP_TEMPLATE_BODY_CLASS_NAME}`);
    const tabCommand = linkType === LinkType.PAGE ? SWITCH_PAGE_LINK_TAB_COMMAND_NAME : SWITCH_EXTERNAL_LINK_TAB_COMMAND_NAME;

    if (!container) {
        return;
    }

    switch (linkType) {
        case LinkType.PAGE:
            showPageLinkForm(container, linkInfo, linkDescriptor, dialogMode);
            break;

        case LinkType.EXTERNAL:
            const { linkUrl, linkText, openInNewTab } = linkDescriptor;
            container!.innerHTML = getExternalLinkConfigurationPopupTemplate(linkUrl, linkText, openInNewTab, dialogMode);
            break;

        default:
            break;
    }

    const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
    button!.classList.add("fr-active", "fr-selected");

    bindFocusEventToInputs(dialog);

    if (linkType === LinkType.EXTERNAL) {
        const popup = editor.popups.get(popupName);
        editor.accessibility.focusPopup(popup);
    }
}

export function hideLinkConfigurationPopup(this: FroalaEditor) {
    this.popups.hide(INSERT_LINK_POPUP_NAME);
    this.popups.hide(CONFIGURE_PAGE_LINK_POPUP_NAME);
    this.popups.hide(CONFIGURE_EXTERNAL_LINK_POPUP_NAME);
}

const showPageLinkForm = async (container: HTMLElement, linkInfo: LinkInfo, { linkText, openInNewTab, linkUrl }: LinkDescriptor, dialogMode: DialogMode) => {
    container.innerHTML = getPageLinkConfigurationPopupTemplate(linkInfo.linkMetadata.name, linkUrl, linkText, openInNewTab, dialogMode);

    const pageSelector = container!.querySelector<HTMLElement>(".ktc-page-selector");
    const pageSelectButton = container!.querySelector<HTMLInputElement>(".ktc-page-selection");

    pageSelectButton!.addEventListener("click", () => {
        window.kentico.modalDialog.pageSelector.open({
            identifierMode: IdentifierMode.Guid,
            selectedValues: [{ identifier: linkInfo.linkMetadata.identifier }],
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
                    linkInfo = {
                        linkType: LinkType.PAGE,
                        linkMetadata: {
                            name,
                            identifier: nodeGuid,
                        },
                    };

                    if (linkText && !linkText.value) {
                        linkText.value = name;
                        linkText.classList.add("fr-not-empty");
                    }

                    pageSelector!.classList.remove("ktc-page-selector--empty");
                }
            }
        });
    });
}
