import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import { MacrosPlugin, MacroType } from "./macro-types";
import { showActionsPopup, hideActionsPopup } from "./popups";
import { CONFIGURE_URL_MACRO_POPUP_NAME, CONFIGURE_CONTEXT_MACRO_POPUP_NAME, CONFIGURATION_POPUP_NAME, ACTIONS_POPUP_NAME } from "./macro-constants";
import { getShowDialog } from "./popups";

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

    const showConfigureContextMacroPopup = getShowDialog(CONFIGURE_CONTEXT_MACRO_POPUP_NAME, editor.opts.popupEditContextMacroButtons, MacroType.CONTEXT);
    const showConfigureUrlPopup = getShowDialog(CONFIGURE_URL_MACRO_POPUP_NAME, editor.opts.popupEditUrlMacroButtons, MacroType.URL);
    const showConfigurationPopup = getShowDialog(CONFIGURATION_POPUP_NAME, editor.opts.popupConfigureButtons, MacroType.URL);

    const macroPlugin = {
        showConfigureContextMacroPopup: showConfigureContextMacroPopup.bind(editor),
        showConfigureUrlPopup: showConfigureUrlPopup.bind(editor),
        showConfigurationPopup: showConfigurationPopup.bind(editor),
    } as MacrosPlugin;

    return [showActionsPopup, hideActionsPopup, hideConfigurationPopup, hidePopups].reduce((accumulator: MacrosPlugin, currentValue) => {
        accumulator[currentValue.name] = currentValue.bind(editor);
        
        return accumulator;
    }, macroPlugin);
}
