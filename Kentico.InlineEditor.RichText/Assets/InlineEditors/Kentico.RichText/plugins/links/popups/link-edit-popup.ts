import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { showPopup, getDialogElement, bindFocusEventToInputs } from "../../popup-helper";
import { INSERT_LINK_POPUP_NAME, CONFIGURE_PAGE_LINK_POPUP_NAME, SWITCH_PATH_TAB_COMMAND_NAME, SWITCH_EXTERNAL_LINK_TAB_COMMAND_NAME } from "../link-constants";
import { getLinkConfigurationPopupTemplate, getExternalLinkConfigurationPopupTemplate } from "../link-templates";
import { DialogMode } from "../../plugin-types";
import { getString, getPathSelectorMetadata } from "../../links/link-helpers";
import { LinkDescriptor, LinkType } from "../link-types";
import { IdentifierMode } from "@/types/kentico/selectors/page-selector-open-options";

const POPUP_TEMPLATE_BODY_CLASS_NAME = "ktc-configure-popup";

export function hideLinkConfigurationPopup(this: FroalaEditor) {
    this.popups.hide(INSERT_LINK_POPUP_NAME);
    this.popups.hide(CONFIGURE_PAGE_LINK_POPUP_NAME);
}

export const getShowLinkPopup = (popupName: string, buttons: any[], linkType: LinkType) => {
    return async function (this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor, dialogMode: DialogMode = DialogMode.INSERT) {
        const customLayer = "<div class=\"ktc-configure-popup\"></div>";
        showPopup(this, popupName, relatedElementPosition, buttons, customLayer);
        await showForm(this, popupName, linkDescriptor, linkType, dialogMode);
    }
}

export const showForm = async (editor: FroalaEditor, popupName: string, linkDescriptor: LinkDescriptor, linkType: LinkType, dialogMode: DialogMode = DialogMode.INSERT) => {
    const dialog = getDialogElement(editor, popupName);

    if (!dialog) {
        return;
    }

    const container = dialog.querySelector<HTMLElement>(`.${POPUP_TEMPLATE_BODY_CLASS_NAME}`);
    const tabCommand = linkType === LinkType.PAGE ? SWITCH_PATH_TAB_COMMAND_NAME : SWITCH_EXTERNAL_LINK_TAB_COMMAND_NAME;

    if (!container) {
        return;
    }

    if (linkType === LinkType.PAGE) {
        showPageLinkForm(editor, container, linkDescriptor, dialogMode)
    } else {
        const { linkUrl, linkText, openInNewTab } = linkDescriptor;
        container!.innerHTML = getExternalLinkConfigurationPopupTemplate(linkUrl, linkText, openInNewTab, dialogMode);
    }

    const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
    button!.classList.add("fr-active", "fr-selected");

    bindFocusEventToInputs(dialog);

    if (linkType === LinkType.EXTERNAL) {
        const popup = editor.popups.get(popupName);
        editor.accessibility.focusPopup(popup);
    }
}

const showPageLinkForm = async (editor: FroalaEditor, container: HTMLElement, { linkText, openInNewTab, linkUrl }: LinkDescriptor, dialogMode: DialogMode) => {
    const getPageEndpointUrl = editor.opts.getPageEndpointUrl;
    let pathSelectorMetadata = await getPathSelectorMetadata(getPageEndpointUrl, linkUrl, dialogMode);
    container!.innerHTML = getLinkConfigurationPopupTemplate(pathSelectorMetadata.name, linkUrl, linkText, openInNewTab, dialogMode);

    const pageSelector = container!.querySelector<HTMLElement>(".ktc-page-selector");
    const pageSelectButton = container!.querySelector<HTMLInputElement>(".ktc-page-selection");

    pageSelectButton!.addEventListener("click", () => {
        window.kentico.modalDialog.pageSelector.open({
            identifierMode: IdentifierMode.Guid,
            selectedValues: [{ identifier: pathSelectorMetadata.nodeGuid }],
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
                    pathSelectorMetadata = {
                        name,
                        nodeGuid,
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
