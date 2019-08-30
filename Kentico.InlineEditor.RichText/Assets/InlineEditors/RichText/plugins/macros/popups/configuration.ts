import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { MACROS_PLUGIN_NAME, SWITCH_URL_TAB_COMMAND_NAME, SWITCH_MACRO_TAB_COMMAND_NAME } from "../macro-constants";
import { getConfigureUrlParameterElement, getConfigureMacroElement } from "../macro-templates";

export const CONFIGURATION_POPUP_NAME = `${MACROS_PLUGIN_NAME}.popupConfigure`;

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

export function showConfigurationPopup(this: FroalaEditor, element: HTMLElement) {
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

    showUrlParameterForm.call(this);
}

export function showUrlParameterForm(this: FroalaEditor) {
    const dialog = getDialogElement(this, CONFIGURATION_POPUP_NAME);
    const container = dialog.querySelector(".ktc-configure-popup") as HTMLElement;

    container.innerHTML = getConfigureUrlParameterElement();

    const button = dialog.querySelector(`.fr-command[data-cmd="${SWITCH_URL_TAB_COMMAND_NAME}"]`) as HTMLButtonElement;
    button.classList.add("fr-active", "fr-selected");
}

export function showMacroForm(editor: FroalaEditor) {
    const dialog = getDialogElement(editor, CONFIGURATION_POPUP_NAME);
    const container = dialog.querySelector(".ktc-configure-popup");

    if (container) {
        container.innerHTML = getConfigureMacroElement();
    }

    const button = dialog.querySelector(`.fr-command[data-cmd="${SWITCH_MACRO_TAB_COMMAND_NAME}"]`) as HTMLButtonElement;
    button.classList.add("fr-active", "fr-selected");
}

export function hideConfigurationPopup(this: FroalaEditor) {
    this.popups.hide(CONFIGURATION_POPUP_NAME);
}

const getDialogElement = (editor: FroalaEditor, popupName: string): HTMLElement => {
    const jDialog = editor.popups.get(popupName);
    const dialog = (jDialog as any)[0] as HTMLElement;

    return dialog;
};

