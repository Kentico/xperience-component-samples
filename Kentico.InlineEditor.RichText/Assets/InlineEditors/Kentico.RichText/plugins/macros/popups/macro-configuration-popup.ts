import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { MacroType } from "../macro-types";
import { DialogMode } from "../../plugin-types";
import { getDialogElement, showPopup, bindFocusEventToInputs } from "../../popup-helper";
import { getConfigureUrlParameterElement, getConfigureContextMacroElement } from "../macro-templates";
import { SWITCH_URL_TAB_COMMAND_NAME, SWITCH_MACRO_TAB_COMMAND_NAME } from "../macro-constants";

export const getShowPopup = (popupName: string, buttons: any[], macroType: MacroType) => {
    return function (this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, mode: DialogMode, macroValue: string = "", macroDefaultValue: string = "") {
        const customLayer = "<div class=\"ktc-configure-popup\"></div>";
        showPopup(this, popupName, relatedElementPosition, buttons, customLayer);
        showForm(this, popupName, mode, macroType, macroValue, macroDefaultValue);
    };
}

export const showForm = (editor: FroalaEditor, popupName: string, mode: DialogMode = DialogMode.INSERT, macroType: MacroType, macroValue: string = "", macroDefaultValue: string = "") => {
    macroDefaultValue = macroDefaultValue.trim().replace(/"/g, "&quot;");

    const dialog = getDialogElement(editor, popupName);
    
    if (dialog) {
        const container = dialog.querySelector<HTMLElement>(".ktc-configure-popup");
        let tabCommand = "";

        if (macroType === MacroType.URL) {
            container!.innerHTML = getConfigureUrlParameterElement(mode, macroValue, macroDefaultValue);
            tabCommand = SWITCH_URL_TAB_COMMAND_NAME;
        } else {
            container!.innerHTML = getConfigureContextMacroElement(mode, editor.opts.contextMacros, macroValue, macroDefaultValue);
            tabCommand = SWITCH_MACRO_TAB_COMMAND_NAME;
        }

        const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
        button!.classList.add("fr-active", "fr-selected");

        bindFocusEventToInputs(dialog);

        if (macroType === MacroType.URL) {
            const popup = editor.popups.get(popupName);
            editor.accessibility.focusPopup(popup);
        }
    }
}
