import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { MacrosPlugin, MacroType } from "./macro-types";
import { showActionsPopup, hideActionsPopup, unwrapElement } from "./popups";
import { CONFIGURE_URL_MACRO_POPUP_NAME, CONFIGURE_CONTEXT_MACRO_POPUP_NAME, CONFIGURATION_POPUP_NAME, ACTIONS_POPUP_NAME } from "./macro-constants";
import { getShowPopup } from "./popups";

function hidePopups(this: FroalaEditor) {
    if (this.popups.isVisible(ACTIONS_POPUP_NAME)) {
        this.popups.hide(ACTIONS_POPUP_NAME);
    }

    hideConfigurationPopup.call(this);
}

function hideConfigurationPopup(this: FroalaEditor) {
    if (this.popups.isVisible(CONFIGURE_URL_MACRO_POPUP_NAME)) {
        this.popups.hide(CONFIGURE_URL_MACRO_POPUP_NAME);
    }

    if (this.popups.isVisible(CONFIGURE_CONTEXT_MACRO_POPUP_NAME)) {
        this.popups.hide(CONFIGURE_CONTEXT_MACRO_POPUP_NAME);
    }

    if (this.popups.isVisible(CONFIGURATION_POPUP_NAME)) {
        this.popups.hide(CONFIGURATION_POPUP_NAME);
    }
}

export const macroPlugin = (editor: FroalaEditor): MacrosPlugin => {
    const allowContextMacros = !!unwrapElement(editor.$oel)!.dataset.allowContextMacros;
    const configurePopupButtons = editor.opts.popupConfigureButtons as any[];

    if (!allowContextMacros) {
        // Remove 'Context macro' tab
        configurePopupButtons.pop();
    }

    const macroPlugin: MacrosPlugin = {
        showActionsPopup,
        hideActionsPopup,
        showConfigureContextMacroPopup: getShowPopup(CONFIGURE_CONTEXT_MACRO_POPUP_NAME, editor.opts.popupEditContextMacroButtons, MacroType.CONTEXT),
        showConfigureUrlPopup: getShowPopup(CONFIGURE_URL_MACRO_POPUP_NAME, editor.opts.popupEditUrlMacroButtons, MacroType.URL),
        showConfigurationPopup: getShowPopup(CONFIGURATION_POPUP_NAME, configurePopupButtons, MacroType.URL),
        hideConfigurationPopup,
        hidePopups
    };

    Object.keys(macroPlugin).forEach((key) => {
        macroPlugin[key] = macroPlugin[key].bind(editor);
    });

    return macroPlugin;
}
