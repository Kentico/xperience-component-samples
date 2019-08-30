import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import { MACRO_ACTIVE_CLASS } from "./macro-constants";
import { showMacroForm, showUrlParameterForm, hideConfigurationPopup } from "./popups";
import { getMacroEditModeElement } from "./macro-templates";

export const insertMacroCommand: RegisterCommandParameters = {
    title: 'Insert Dynamic Text',
    icon: 'insertMacro',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor) {
        this.html.insert(`${getMacroEditModeElement()} `);
        this.undo.saveStep();

        this.toolbar.hide();
    }
}

export const removeMacroCommand: RegisterCommandParameters = {
    title: "Remove",
    icon: "remove",
    focus: false,
    undo: true,
    refreshAfterCallback: false,
    callback(this: FroalaEditor) {
        const macroEl = this.el.querySelector<HTMLElement>(`.${MACRO_ACTIVE_CLASS}`);
        if (macroEl) {
            macroEl.remove();
        }

        this.kenticoMacroPlugin.hideActionsPopup();
    }
}

export const configureMacroCommand: RegisterCommandParameters = {
    title: "Configure",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        this.kenticoMacroPlugin.showConfigurationPopup((this.$oel as any)[0]);
    }
}

export const openMacroTabCommand: RegisterCommandParameters = {
    title: "Insert macro",
    icon: "macro",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showMacroForm(this);
    }    
};


export const openQueryTabCommand: RegisterCommandParameters = {
    title: "URL parameter",
    icon: "queryString",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showUrlParameterForm.call(this);
    }    
};

export const closeConfigurePopupCommand: RegisterCommandParameters = {
    title: 'Back',
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
      hideConfigurationPopup.call(this);
    }
}