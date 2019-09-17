import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { DialogMode, MacroType } from "../macro-types";
import { getDialogElement, showPopup } from "./popup-helper";
import { getConfigureUrlParameterElement, getConfigureContextMacroElement } from "../macro-templates";
import { SWITCH_URL_TAB_COMMAND_NAME, SWITCH_MACRO_TAB_COMMAND_NAME } from "../macro-constants";

export function getShowPopup(popupName: string, buttons: any[], macroType: MacroType) {
    return function (this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, mode: DialogMode, macroValue: string = "", macroDefaultValue: string = "") {
        const customLayer = "<div class=\"ktc-configure-popup\"></div>";
        showPopup(this, popupName, relatedElementPosition, buttons, customLayer);
        showForm(this, popupName, mode, macroType, macroValue, macroDefaultValue);
    };
}

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

        if (macroType === MacroType.URL) {
            const popup = editor.popups.get(popupName);
            editor.accessibility.focusPopup(popup);
        }
    }
}
