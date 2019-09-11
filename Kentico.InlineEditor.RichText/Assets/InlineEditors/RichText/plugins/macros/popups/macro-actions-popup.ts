import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { MACRO_ACTIVE_CLASS, ACTIONS_POPUP_NAME } from "../macro-constants";
import { initializePopup } from "./popup-helper";

export function showActionsPopup(this: FroalaEditor, macroElement: HTMLElement) {
    // Get the popup object defined above.
    let $popup = this.popups.get(ACTIONS_POPUP_NAME);

    // If popup doesn't exist then create it.
    // To improve performance it is best to create the popup when it is first needed
    // and not when the editor is initialized.
    if (!$popup) {
        $popup = initializePopup(this, ACTIONS_POPUP_NAME, this.opts.popupActionButtons);
    }

    // Set the editor toolbar as the popup's container.
    this.popups.setContainer(ACTIONS_POPUP_NAME, this.$oel);

    // Compute the popup's position.
    const { top, left } = macroElement.getBoundingClientRect();
    const offsetLeft = left + macroElement.offsetWidth / 2;
    const offsetTop = top + window.pageYOffset;

    // Show the custom popup.
    // The button's outerHeight is required in case the popup needs to be displayed above it.
    this.popups.show(ACTIONS_POPUP_NAME, offsetLeft, offsetTop, macroElement.offsetHeight);

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

