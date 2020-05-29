import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { ACTIONS_POPUP_NAME, MACRO_ACTIVE_CLASS, ACTIONS_POPUP_WIDTH_PX } from "../macro-constants";
import { showPopup } from "../../popup-helper";
import { DialogMode } from "@/Kentico.InlineEditor.RichText/Assets/InlineEditors/Kentico.RichText/plugins/plugin-types";

export function showActionsPopup(this: FroalaEditor, macroElement: HTMLElement) {
    showPopup(this, ACTIONS_POPUP_NAME, macroElement.getBoundingClientRect(), this.opts.popupActionButtons, DialogMode.UPDATE, ACTIONS_POPUP_WIDTH_PX);

    const currentActiveMacroEl = this.el.querySelector(`.${MACRO_ACTIVE_CLASS}`)
    if (currentActiveMacroEl) {
        currentActiveMacroEl.classList.remove(MACRO_ACTIVE_CLASS);
    }

    macroElement.classList.add(MACRO_ACTIVE_CLASS);
}

// Hide the custom popup.
export function hideActionsPopup(this: FroalaEditor) {
    this.popups.hide(ACTIONS_POPUP_NAME);

    const activeMacro = this.el.querySelector(`.${MACRO_ACTIVE_CLASS}`);
    if (activeMacro) {
        activeMacro.classList.remove(MACRO_ACTIVE_CLASS);
    }
}
