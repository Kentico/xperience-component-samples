import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import { MacrosPlugin, MacroType } from "./macro-types";
import { showActionsPopup, showConfigurationPopup, hideActionsPopup } from "./popups";
import { showConfigureUrlPopup } from "./popups/configure-url-macro";
import { CONFIGURE_URL_MACRO_POPUP_NAME, CONFIGURE_CONTEXT_MACRO_POPUP_NAME, CONFIGURATION_POPUP_NAME, ACTIONS_POPUP_NAME } from "./macro-constants";
import { getShowDialog } from "./popups/popup-helper";

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

    const showConfigureContextMacroPopup = getShowDialog(editor, CONFIGURE_CONTEXT_MACRO_POPUP_NAME, editor.opts.popupEditContextMacroButtons, MacroType.CONTEXT);
    const macroPlugin = {
        showConfigureContextMacroPopup: showConfigureContextMacroPopup.bind(editor),
    } as MacrosPlugin;

    return [showActionsPopup, hideActionsPopup, showConfigurationPopup, hideConfigurationPopup, hidePopups, showConfigureUrlPopup].reduce((accumulator: MacrosPlugin, currentValue) => {
        accumulator[currentValue.name] = currentValue.bind(editor);
        
        return accumulator;
    }, macroPlugin);
}
