import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { DialogMode, MacroType } from "../macro-types";
import { getDialogElement, initializePopup } from "./popup-helper";
import { getConfigureUrlParameterElement, getConfigureContextMacroElement } from "../macro-templates";
import { SWITCH_URL_TAB_COMMAND_NAME, SWITCH_MACRO_TAB_COMMAND_NAME } from "../macro-constants";

export const showForm = (editor: FroalaEditor, popupName: string, mode: DialogMode = DialogMode.INSERT, macroType: MacroType, macroValue: string = "", macroDefaultValue: string = "") => {
    const dialog = getDialogElement(editor, popupName);
    if (dialog) {
        const container = dialog.querySelector<HTMLElement>(".ktc-configure-popup");
        let tabCommand = "";

        if (macroType === MacroType.URL) {
            container!.innerHTML = getConfigureUrlParameterElement(mode, macroValue, macroDefaultValue);
            tabCommand = SWITCH_URL_TAB_COMMAND_NAME;

        } else {
            container!.innerHTML = getConfigureContextMacroElement(mode, macroValue, macroDefaultValue);
            tabCommand = SWITCH_MACRO_TAB_COMMAND_NAME;
        }

        const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
        button!.classList.add("fr-active", "fr-selected");
    }
}

export function getShowDialog(popupName: string, buttons: any[], macroType: MacroType) {
    return function (this: FroalaEditor, relatedElement: DOMRect, mode: DialogMode, macroValue: string, macroDefaultValue: string) {
        // Get the popup object defined above.
        var $popup = this.popups.get(popupName);

        // If popup doesn't exist then create it.
        // To improve performance it is best to create the popup when it is first needed
        // and not when the this is initialized.
        const customLayer = "<div class=\"ktc-configure-popup\"></div>";
        if (!$popup) $popup = initializePopup(this, popupName, buttons, customLayer);

        // Set the this toolbar as the popup's container.
        this.popups.setContainer(popupName, this.$oel);

        // Compute the popup's position.
        const { top, left, width, height } = relatedElement;
        const offsetLeft = left + width / 2;
        const offsetTop = top + window.pageYOffset;

        // Show the custom popup.
        // The button's outerHeight is required in case the popup needs to be displayed above it.
        this.popups.show(popupName, offsetLeft, offsetTop, height);

        showForm(this, popupName, mode, macroType, macroValue, macroDefaultValue);
    };
}