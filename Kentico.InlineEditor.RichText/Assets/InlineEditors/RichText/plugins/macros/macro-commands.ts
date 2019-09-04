import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import { MACRO_ACTIVE_CLASS, OPEN_INSERT_MACRO_POPUP_COMMAND_NAME, INSERT_URL_MACRO_COMMAND_NAME, CONFIGURE_URL_MACRO_POPUP_NAME, CONFIGURATION_POPUP_NAME, MACROS_PLUGIN_NAME } from "./macro-constants";
import { showMacroForm } from "./popups";
import { getMacroEditModeElement } from "./macro-templates";
import { DialogMode, MacroType } from "./macro-types";
import { unwrapElement } from "./macro-helpers";
import { showUrlParameterForm } from "./popups/popup-helper";

export const openInsertMacroPopupCommand: RegisterCommandParameters = {
    title: 'Insert Dynamic Text',
    icon: OPEN_INSERT_MACRO_POPUP_COMMAND_NAME,
    focus: true,
    undo: false,
    plugin: MACROS_PLUGIN_NAME,
    refreshAfterCallback: true,
    callback(this: FroalaEditor) {
        this.kenticoMacroPlugin.showConfigurationPopup(this.el, DialogMode.INSERT);
    }
}

export const insertMacro: RegisterCommandParameters = {
    title: "",
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor, commandName: string) {
        const macroType = commandName === INSERT_URL_MACRO_COMMAND_NAME ? MacroType.URL : MacroType.CONTEXT;

        const popupElement = unwrapElement(this.popups.get(CONFIGURATION_POPUP_NAME));

        let macroValue = "";
        let macroDefaultValue = "";

        if (macroType === MacroType.URL) {
            const urlParameterNameElement = popupElement!.querySelector<HTMLInputElement>("input[name='urlParameterName']");
            macroValue = urlParameterNameElement!.value;
            const defaultValue = popupElement!.querySelector<HTMLInputElement>("input[name='defaultText']");
            macroDefaultValue = defaultValue!.value;
        } else {
            const contextMacroTypeElement = popupElement!.querySelector<HTMLSelectElement>("select[name='contextMacroType']");
            macroValue = contextMacroTypeElement!.options[contextMacroTypeElement!.selectedIndex].value;
            const defaultValue = popupElement!.querySelector<HTMLInputElement>("input[name='defaultText']");
            macroDefaultValue = defaultValue!.value;
        }
        
        this.html.insert(`${getMacroEditModeElement(macroType, macroValue, macroDefaultValue)} `);
        this.undo.saveStep();
        this.toolbar.hide();
        this.kenticoMacroPlugin.hideConfigurationPopup();
    }
}

export const updateMacro: RegisterCommandParameters = {
    title: "",
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor) {
        this.undo.saveStep();

        const macroElement = this.el.querySelector<HTMLElement>(`.${MACRO_ACTIVE_CLASS}`);

        if (macroElement) {
            const popupElement = unwrapElement(this.popups.get(CONFIGURE_URL_MACRO_POPUP_NAME));
            const urlParameterName = popupElement!.querySelector<HTMLInputElement>("input[name='urlParameterName']");
            const defaultValue = popupElement!.querySelector<HTMLInputElement>("input[name='defaultText']");
            macroElement.dataset.macroValue = urlParameterName!.value;
            macroElement.dataset.macroDefaultValue = defaultValue!.value;
        }

        this.kenticoMacroPlugin.hidePopups();
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
        const macroEl = this.el.querySelector<HTMLElement>(`.${MACRO_ACTIVE_CLASS}`);
        if (macroEl) {
            const dataset = macroEl.dataset as { macroType: MacroType, macroValue: string, macroDefaultValue: string };
            const { macroValue, macroDefaultValue, macroType } = dataset;

            if (macroType === MacroType.URL) {
                this.kenticoMacroPlugin.showConfigureUrlPopup(macroEl, DialogMode.UPDATE, macroValue, macroDefaultValue);
            } else {
                this.kenticoMacroPlugin.showConfigureContextMacroPopup(macroEl, DialogMode.UPDATE, macroValue, macroDefaultValue);
            }
        }
    }
}

export const openMacroTabCommand: RegisterCommandParameters = {
    title: "Insert macro",
    icon: "macro",
    undo: false,
    focus: false,
    callback(this: FroalaEditor, button: string) {
        showMacroForm(this);
    }
};

export const openQueryTabCommand: RegisterCommandParameters = {
    title: "URL parameter",
    icon: "queryString",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showUrlParameterForm(this, CONFIGURE_URL_MACRO_POPUP_NAME);
    }
};

export const closeConfigurePopupCommand: RegisterCommandParameters = {
    title: 'Back',
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        this.kenticoMacroPlugin.hideConfigurationPopup();
    }
}
