import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { showPopup, getDialogElement } from "../../popup-helper";
import { INSERT_LINK_POPUP_NAME, UPDATE_LINK_POPUP_NAME } from "../link-constants";
import { getLinkConfigurationPopupTemplate } from "../link-templates";
import { DialogMode } from "../../plugin-types";
import * as constants from "../link-constants";

export function showLinkPopup(this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, 
  { linkText, path }: { linkText: string, path: string }, dialogMode: DialogMode = DialogMode.INSERT) {

  const popupName = dialogMode === DialogMode.INSERT ? INSERT_LINK_POPUP_NAME : UPDATE_LINK_POPUP_NAME;
  const popupButtons = dialogMode === DialogMode.INSERT ? this.opts.popupInsertLinkButtons : this.opts.popupUpdateLinkButtons;
  const customLayer = "<div class=\"ktc-configure-popup\"></div>";

  showPopup(this, popupName, relatedElementPosition, popupButtons, customLayer);

  const dialog = getDialogElement(this, popupName);
    
    if (dialog) {
        const container = dialog.querySelector<HTMLElement>(".ktc-configure-popup");
        container!.innerHTML = getLinkConfigurationPopupTemplate(path, linkText, dialogMode);

        const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${constants.SWITCH_PATH_TAB_COMMAND_NAME}"]`);
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

        // this.accessibility.focusPopup(popupName);
    }
}

export function hideLinkConfigurationPopup(this: FroalaEditor) {
  this.popups.hide(INSERT_LINK_POPUP_NAME);
  this.popups.hide(UPDATE_LINK_POPUP_NAME);
}
