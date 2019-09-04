import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { CONFIGURE_URL_MACRO_POPUP_NAME } from "../macro-constants";
import { DialogMode } from "../macro-types";
import { showUrlParameterForm } from "./popup-helper";

function initPopup(this: FroalaEditor) {
    // Popup buttons.
    let popup_buttons = "";

    // Create the list of buttons.
    if (this.opts.popupEditUrlMacroButtons.length >= 1) {
        popup_buttons += '<div class="fr-buttons">';
        popup_buttons += this.button.buildList(this.opts.popupEditUrlMacroButtons);
        popup_buttons += '</div>';
    }

    // Load popup template.
    const template = {
        buttons: popup_buttons,
        custom_layer: "<div class=\"ktc-configure-popup\"></div>",
    };

    // Create popup.
    var $popup = this.popups.create(CONFIGURE_URL_MACRO_POPUP_NAME, template);

    return $popup;
}

export function showConfigureUrlPopup(this: FroalaEditor, macroElement: HTMLElement, mode: DialogMode, macroValue: string, macroDefaultValue: string) {
    // Get the popup object defined above.
    var $popup = this.popups.get(CONFIGURE_URL_MACRO_POPUP_NAME);

    // If popup doesn't exist then create it.
    // To improve performance it is best to create the popup when it is first needed
    // and not when the this is initialized.
    if (!$popup) $popup = initPopup.call(this);

    // Set the this toolbar as the popup's container.
    this.popups.setContainer(CONFIGURE_URL_MACRO_POPUP_NAME, this.$oel);

    // Compute the popup's position.
    const { top, left } = macroElement.getBoundingClientRect();
    const offsetLeft = left + macroElement.offsetWidth / 2;
    const offsetTop = top + window.pageYOffset;

    // Show the custom popup.
    // The button's outerHeight is required in case the popup needs to be displayed above it.
    this.popups.show(CONFIGURE_URL_MACRO_POPUP_NAME, offsetLeft, offsetTop, macroElement.offsetHeight);

    showUrlParameterForm(this, CONFIGURE_URL_MACRO_POPUP_NAME, mode, macroValue, macroDefaultValue);
}
