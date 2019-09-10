import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import * as constants from "./macro-constants";
import { getMacroEditModeElement } from "./macro-templates";
import { DialogMode, MacroType } from "./macro-types";
import { getMacroDisplayName } from "./macro-helpers";
import { showForm, getDialogElement } from "./popups";

export const openInsertMacroPopupCommand: RegisterCommandParameters = {
    title: 'Insert Dynamic Text',
    icon: constants.OPEN_INSERT_MACRO_POPUP_COMMAND_NAME,
    focus: true,
    undo: false,
    plugin: constants.MACROS_PLUGIN_NAME,
    refreshAfterCallback: true,
    callback(this: FroalaEditor) {
        this.kenticoMacroPlugin.showConfigurationPopup(this.position.getBoundingRect(), DialogMode.INSERT);
    }
}

export const insertMacro: RegisterCommandParameters = {
    title: "",
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor, commandName: string) {
        const popupElement = getDialogElement(this, constants.CONFIGURATION_POPUP_NAME);
        
        if (popupElement) {
            this.undo.saveStep();
            const form = popupElement.querySelector<HTMLFormElement>("#ktc-form");
            const formData = new FormData(form!);
            const macroType = commandName === constants.INSERT_URL_MACRO_COMMAND_NAME ? MacroType.URL : MacroType.CONTEXT;

            let macroValue = "";
            let macroDisplayValue = "";

            if (macroType === MacroType.URL) {
                const urlParameterName = formData.get("urlParameterName") as string;
                macroValue = `QueryString.${urlParameterName}`;
                macroDisplayValue = getMacroDisplayName(urlParameterName);
            } else if (macroType === MacroType.CONTEXT) {
                macroValue = formData.get("contextMacroType") as string;
                macroDisplayValue = getMacroDisplayName(macroValue);
            }

            const macroDefaultValue = formData.get("defaultText") as string;

            this.html.insert(`${getMacroEditModeElement(macroType, macroValue, macroDefaultValue, macroDisplayValue)} `);
            this.toolbar.hide();
            this.kenticoMacroPlugin.hideConfigurationPopup();
        }
    }
}

export const updateMacro: RegisterCommandParameters = {
    title: "",
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor, commandName) {
        const macroElement = this.el.querySelector<HTMLElement>(`.${constants.MACRO_ACTIVE_CLASS}`);
        const popupName = commandName === constants.UPDATE_URL_MACRO_COMMAND_NAME
        ? constants.CONFIGURE_URL_MACRO_POPUP_NAME
        : commandName === constants.UPDATE_CONTEXT_MACRO_COMMAND_NAME
        ? constants.CONFIGURE_CONTEXT_MACRO_POPUP_NAME : "";
        const popupElement = getDialogElement(this, popupName);
        
        if (popupElement && macroElement) {
            this.undo.saveStep();
            const form = popupElement.querySelector<HTMLFormElement>("#ktc-form");
            const formData = new FormData(form!);
            const macroValue = formData.get(commandName === constants.UPDATE_URL_MACRO_COMMAND_NAME ? "urlParameterName" : "contextMacroType") as string;

            const data = {
                macroValue: commandName === constants.UPDATE_URL_MACRO_COMMAND_NAME ? `QueryString.${macroValue}` : macroValue,
                macroDefaultValue: formData.get("defaultText"),
            };

            macroElement.textContent = getMacroDisplayName(macroValue);
            Object.assign(macroElement.dataset, data);
            this.kenticoMacroPlugin.hidePopups();
        }
    }
}

export const removeMacroCommand: RegisterCommandParameters = {
    title: "Remove",
    icon: "remove",
    focus: false,
    undo: true,
    refreshAfterCallback: false,
    callback(this: FroalaEditor) {
        const macroEl = this.el.querySelector<HTMLElement>(`.${constants.MACRO_ACTIVE_CLASS}`);
        if (macroEl) {
            this.undo.saveStep();
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
        const macroEl = this.el.querySelector<HTMLElement>(`.${constants.MACRO_ACTIVE_CLASS}`);
        if (macroEl) {
            const dataset = macroEl.dataset as { macroType: MacroType, macroValue: string, macroDefaultValue: string };
            const { macroValue, macroDefaultValue, macroType } = dataset;
            const macroElementRect = macroEl.getBoundingClientRect();

            if (macroType === MacroType.URL) {
                this.kenticoMacroPlugin.showConfigureUrlPopup(macroElementRect, DialogMode.UPDATE, macroValue.replace("QueryString.", ""), macroDefaultValue);
            } else {
                this.kenticoMacroPlugin.showConfigureContextMacroPopup(macroElementRect, DialogMode.UPDATE, macroValue, macroDefaultValue);
            }
        }
    }
}

export const openMacroTabCommand: RegisterCommandParameters = {
    title: "Insert macro",
    icon: "macro",
    undo: false,
    focus: true,
    callback(this: FroalaEditor) {
        showForm(this, constants.CONFIGURATION_POPUP_NAME, DialogMode.INSERT, MacroType.CONTEXT);
    }
};

export const openQueryTabCommand: RegisterCommandParameters = {
    title: "URL parameter",
    icon: "queryString",
    undo: false,
    focus: true,
    callback(this: FroalaEditor) {
        showForm(this, constants.CONFIGURATION_POPUP_NAME, DialogMode.INSERT, MacroType.URL);
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
