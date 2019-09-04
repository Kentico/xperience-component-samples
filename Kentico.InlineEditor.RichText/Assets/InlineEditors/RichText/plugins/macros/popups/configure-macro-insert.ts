import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { SWITCH_MACRO_TAB_COMMAND_NAME, CONFIGURATION_POPUP_NAME } from "../macro-constants";
import { getConfigureContextMacroElement } from "../macro-templates";
import { DialogMode } from "../macro-types";
import { showUrlParameterForm, getDialogElement } from "./popup-helper";

function initPopup(this: FroalaEditor) {
    // Popup buttons.
    let popup_buttons = "";

    // Create the list of buttons.
    if (this.opts.popupConfigureButtons.length >= 1) {
        popup_buttons += '<div class="fr-buttons">';
        popup_buttons += this.button.buildList(this.opts.popupConfigureButtons);
        popup_buttons += '</div>';
    }

    // Load popup template.
    const template = {
        buttons: popup_buttons,
        custom_layer: "<div class=\"ktc-configure-popup\"></div>",
    };

    // Create popup.
    var $popup = this.popups.create(CONFIGURATION_POPUP_NAME, template);

    return $popup;
}

export function showConfigurationPopup(this: FroalaEditor, element: HTMLElement, mode: DialogMode) {
    // Get the popup object defined above.
    var $popup = this.popups.get(CONFIGURATION_POPUP_NAME);

    // If popup doesn't exist then create it.
    // To improve performance it is best to create the popup when it is first needed
    // and not when the this is initialized.
    if (!$popup) $popup = initPopup.call(this);

    // Set the this toolbar as the popup's container.
    this.popups.setContainer(CONFIGURATION_POPUP_NAME, this.$oel);

    // Compute the popup's position.
    const { top, left } = element.getBoundingClientRect();
    var offsetLeft = left + element.offsetWidth / 2;
    var offsetTop = top;// + macroEl.offsetHeight;

    // Show the custom popup.
    // The button's outerHeight is required in case the popup needs to be displayed above it.
    this.popups.show(CONFIGURATION_POPUP_NAME, offsetLeft, offsetTop, element.offsetHeight);

    showUrlParameterForm(this, CONFIGURATION_POPUP_NAME);
}

export function showMacroForm(editor: FroalaEditor) {
    const dialog = getDialogElement(editor, CONFIGURATION_POPUP_NAME);

    if (dialog) {
        const container = dialog.querySelector(".ktc-configure-popup");

        if (container) {
            container.innerHTML = getConfigureContextMacroElement(DialogMode.INSERT);
        }

        const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${SWITCH_MACRO_TAB_COMMAND_NAME}"]`);
        button!.classList.add("fr-active", "fr-selected");
    }
}

export function hideConfigurationPopup(this: FroalaEditor) {
    this.popups.hide(CONFIGURATION_POPUP_NAME);
}



