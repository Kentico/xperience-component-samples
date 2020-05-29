import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { ACTIONS_POPUP_NAME, MACRO_ACTIVE_CLASS, ACTIONS_POPUP_WIDTH_PX } from "../macro-constants";
import { showPopup } from "../../popup-helper";
import { DialogMode } from "../../plugin-types";

export function showActionsPopup(this: FroalaEditor, macroElement: Element) {
    const currentActiveMacroEl = this.kenticoMacroPlugin.getActiveMacro();
    if (currentActiveMacroEl) {
        currentActiveMacroEl.classList.remove(MACRO_ACTIVE_CLASS);
    }
    
    macroElement.classList.add(MACRO_ACTIVE_CLASS);
    showPopup(this, ACTIONS_POPUP_NAME, this.opts.popupActionButtons, DialogMode.UPDATE, ACTIONS_POPUP_WIDTH_PX, () => this.kenticoMacroPlugin.getActiveMacro()!);
}

// Hide the custom popup.
export function hideActionsPopup(this: FroalaEditor) {
    this.popups.hide(ACTIONS_POPUP_NAME);

    const activeMacro = this.el.querySelector(`.${MACRO_ACTIVE_CLASS}`);
    if (activeMacro) {
        activeMacro.classList.remove(MACRO_ACTIVE_CLASS);
    }
}
