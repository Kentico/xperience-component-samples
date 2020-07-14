import FroalaEditor, { Position } from "froala-editor/js/froala_editor.pkgd.min";

import { MacroType } from "../macro-types";
import { DialogMode } from "../../plugin-types";
import { getDialogElement, showPopup, bindFocusEventToInputs } from "../../popup-helper";
import { getConfigureUrlParameterElement, getConfigureContextMacroElement } from "../macro-templates";
import { SWITCH_URL_TAB_COMMAND_NAME, SWITCH_MACRO_TAB_COMMAND_NAME, CONFIGURATION_POPUP_WIDTH_PX } from "../macro-constants";
import { ACTIVE_POPUP_TAB_CLASS_NAME } from "../../../constants";

export const getShowPopup = (popupName: string, buttons: any[], macroType: MacroType) => {
    return function (this: FroalaEditor, mode: DialogMode, getRelatedElement?: () => Element, macroValue: string = "", macroDefaultValue: string = "") {
        const customLayer = "<div class=\"ktc-configure-popup\"></div>";
        showPopup(this, popupName, buttons, mode, CONFIGURATION_POPUP_WIDTH_PX, getRelatedElement, customLayer);
        showForm(this, popupName, mode, macroType, macroValue, macroDefaultValue);
    };
}

export const showForm = (editor: FroalaEditor, popupName: string, mode: DialogMode = DialogMode.INSERT, macroType: MacroType, macroValue: string = "", macroDefaultValue: string = "") => {
    macroDefaultValue = macroDefaultValue.trim().replace(/"/g, "&quot;");

    const dialog = getDialogElement(editor, popupName);
    
    if (dialog) {
        const container = dialog.querySelector<HTMLElement>(".ktc-configure-popup");
        let tabCommand: string;

        if (macroType === MacroType.URL) {
            container!.innerHTML = getConfigureUrlParameterElement(mode, macroValue, macroDefaultValue);
            tabCommand = SWITCH_URL_TAB_COMMAND_NAME;
        } else {
            container!.innerHTML = getConfigureContextMacroElement(mode, editor.opts.contextMacros, macroValue, macroDefaultValue);
            tabCommand = SWITCH_MACRO_TAB_COMMAND_NAME;
        }

        const previousSelectedTab = dialog.querySelector<HTMLButtonElement>(`.fr-command.${ACTIVE_POPUP_TAB_CLASS_NAME}`);
        previousSelectedTab?.classList.remove(ACTIVE_POPUP_TAB_CLASS_NAME);
        const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
        button!.classList.add(ACTIVE_POPUP_TAB_CLASS_NAME);

        bindFocusEventToInputs(dialog);

        if (macroType === MacroType.URL) {
            const popup = editor.popups.get(popupName);
            editor.accessibility.focusPopup(popup);
        }
    }
}
