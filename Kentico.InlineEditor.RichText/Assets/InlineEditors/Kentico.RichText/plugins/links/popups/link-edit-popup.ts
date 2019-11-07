import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { showPopup, getDialogElement } from "../../popup-helper";
import { INSERT_LINK_POPUP_NAME, UPDATE_LINK_POPUP_NAME, SWITCH_PATH_TAB_COMMAND_NAME } from "../link-constants";
import { getLinkConfigurationPopupTemplate, getExternalLinkConfigurationPopupTemplate } from "../link-templates";
import { DialogMode } from "../../plugin-types";
import { getString, getPathSelectorMetadata } from "../../links/link-helpers";
import { LinkDescriptor, ExternalLinkDescriptor } from "../link-types";
import { IdentifierMode } from "@/types/kentico/selectors/page-selector-open-options";

export async function showExternalLinkPopup(
        this: FroalaEditor, 
        relatedElementPosition: DOMRect | ClientRect, 
        { linkText, openInNewTab, linkUrl }: ExternalLinkDescriptor, 
        dialogMode: DialogMode = DialogMode.INSERT
    ) {        
    console.log("clicked external");
    const dialog = getDialogElement(this, INSERT_LINK_POPUP_NAME);

    if (dialog) {
        const container = dialog.querySelector<HTMLElement>(".ktc-configure-popup");
        container!.innerHTML = getExternalLinkConfigurationPopupTemplate(linkUrl, linkText, openInNewTab, dialogMode);
    }
}

export async function showLinkPopup(
        this: FroalaEditor,
        relatedElementPosition: DOMRect | ClientRect,
        { linkText, openInNewTab, path }: LinkDescriptor, 
        dialogMode: DialogMode = DialogMode.INSERT
    ) {

    const popupName = dialogMode === DialogMode.INSERT ? INSERT_LINK_POPUP_NAME : UPDATE_LINK_POPUP_NAME;
    const popupButtons = dialogMode === DialogMode.INSERT ? this.opts.popupInsertLinkButtons : this.opts.popupUpdateLinkButtons;
    const customLayer = "<div class=\"ktc-configure-popup\"></div>";

    showPopup(this, popupName, relatedElementPosition, popupButtons, customLayer);

    const dialog = getDialogElement(this, popupName);
    const getPageEndpointUrl = this.opts.getPageEndpointUrl;

    if (dialog) {
        const container = dialog.querySelector<HTMLElement>(".ktc-configure-popup");
        let pathSelectorMetadata = await getPathSelectorMetadata(getPageEndpointUrl, path, dialogMode);

        container!.innerHTML = getLinkConfigurationPopupTemplate(pathSelectorMetadata.name, path, linkText, openInNewTab, dialogMode);

        const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${SWITCH_PATH_TAB_COMMAND_NAME}"]`);
        button!.classList.add("fr-active", "fr-selected");

        const inputs = dialog.querySelectorAll<HTMLInputElement>(".fr-input-line input");
        inputs.forEach((inputEl) => {
            inputEl.addEventListener("focus", function () {
                if (!this.value) {
                    this.classList.add("fr-not-empty");
                }
            });

            inputEl.addEventListener("blur", function () {
                if (!this.value) {
                    this.classList.remove("fr-not-empty");
                }
            });
        });

        const pageSelector = container!.querySelector<HTMLElement>(".ktc-page-selector");
        const pageSelectButton = container!.querySelector<HTMLInputElement>(".ktc-page-selection");

        pageSelectButton!.addEventListener("click", () => {
            window.kentico.modalDialog.pageSelector.open({
                identifierMode: IdentifierMode.Guid,
                selectedValues: [{ identifier: pathSelectorMetadata.nodeGuid }],
                applyCallback(selectedPages) {
                    if (selectedPages && selectedPages.length) {
                        const pageNameField = container!.querySelector<HTMLLabelElement>(".ktc-page-name")!;
                        const pageUrlField = container!.querySelector<HTMLInputElement>("input[name='pageUrl']");
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
}

export function hideLinkConfigurationPopup(this: FroalaEditor) {
    this.popups.hide(INSERT_LINK_POPUP_NAME);
    this.popups.hide(UPDATE_LINK_POPUP_NAME);
}
