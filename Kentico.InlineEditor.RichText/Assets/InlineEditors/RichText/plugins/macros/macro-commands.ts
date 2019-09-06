import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import * as constants from "./macro-constants";
import { getMacroEditModeElement } from "./macro-templates";
import { DialogMode, MacroType } from "./macro-types";
import { unwrapElement, getContextMacroDisplayName } from "./macro-helpers";
import { showForm } from "./popups";

export const openInsertMacroPopupCommand: RegisterCommandParameters = {
    title: 'Insert Dynamic Text',
    icon: constants.OPEN_INSERT_MACRO_POPUP_COMMAND_NAME,
    focus: true,
    undo: false,
    plugin: constants.MACROS_PLUGIN_NAME,
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
        const macroType = commandName === constants.INSERT_URL_MACRO_COMMAND_NAME ? MacroType.URL : MacroType.CONTEXT;

        const popupElement = unwrapElement(this.popups.get(constants.CONFIGURATION_POPUP_NAME));

        let macroValue = "";
        let macroDefaultValue = "";
        let macroDisplayValue = "";

        if (macroType === MacroType.URL) {
            const urlParameterNameElement = popupElement!.querySelector<HTMLInputElement>("input[name='urlParameterName']");
            const urlParameterName = urlParameterNameElement!.value;
            macroValue = `QueryString.${urlParameterName}`;
            macroDisplayValue = getContextMacroDisplayName(urlParameterName);
            const defaultValue = popupElement!.querySelector<HTMLInputElement>("input[name='defaultText']");
            macroDefaultValue = defaultValue!.value;
        } else {
            const contextMacroTypeElement = popupElement!.querySelector<HTMLSelectElement>("select[name='contextMacroType']");
            macroValue = contextMacroTypeElement!.options[contextMacroTypeElement!.selectedIndex].value;
            macroDisplayValue = getContextMacroDisplayName(macroValue)
            const defaultValue = popupElement!.querySelector<HTMLInputElement>("input[name='defaultText']");
            macroDefaultValue = defaultValue!.value;
        }

        this.undo.saveStep();
        this.html.insert(`${getMacroEditModeElement(macroType, macroValue, macroDefaultValue, macroDisplayValue)} `);
        this.toolbar.hide();
        this.kenticoMacroPlugin.hideConfigurationPopup();
    }
}

export const updateMacro: RegisterCommandParameters = {
    title: "",
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor, commandName) {
        this.undo.saveStep();

        const macroElement = this.el.querySelector<HTMLElement>(`.${constants.MACRO_ACTIVE_CLASS}`);

        if (macroElement) {
            if (commandName === constants.UPDATE_MACRO_COMMAND_NAME) {
                const popupElement = unwrapElement(this.popups.get(constants.CONFIGURE_URL_MACRO_POPUP_NAME));
                const urlParameterNameElement = popupElement!.querySelector<HTMLInputElement>("input[name='urlParameterName']");
                const defaultText = popupElement!.querySelector<HTMLInputElement>("input[name='defaultText']");
                const urlParameterName = urlParameterNameElement!.value;
                const macroValue = `QueryString.${urlParameterName}`;
                macroElement.dataset.macroValue = macroValue;
                macroElement.dataset.macroDefaultValue = defaultText!.value;
                macroElement.textContent = getContextMacroDisplayName(urlParameterName);
            } else if (commandName === constants.UPDATE_CONTEXT_MACRO_COMMAND_NAME) {
                const popupElement = unwrapElement(this.popups.get(constants.CONFIGURE_CONTEXT_MACRO_POPUP_NAME));
                const contextMacroTypeSelectElement = popupElement!.querySelector<HTMLSelectElement>("select[name='contextMacroType']");
                const defaultText = popupElement!.querySelector<HTMLInputElement>("input[name='defaultText']");
                const macroValue = contextMacroTypeSelectElement!.options[contextMacroTypeSelectElement!.selectedIndex].value;
                macroElement.dataset.macroValue = macroValue;
                macroElement.dataset.macroDefaultValue = defaultText!.value;
                macroElement.textContent = getContextMacroDisplayName(macroValue);
            }
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

            if (macroType === MacroType.URL) {
                this.kenticoMacroPlugin.showConfigureUrlPopup(macroEl, DialogMode.UPDATE, macroValue.replace("QueryString.", ""), macroDefaultValue);
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
        showForm(this, constants.CONFIGURATION_POPUP_NAME, DialogMode.INSERT, MacroType.CONTEXT);
    }
};

export const openQueryTabCommand: RegisterCommandParameters = {
    title: "URL parameter",
    icon: "queryString",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showForm(this, constants.CONFIGURE_URL_MACRO_POPUP_NAME, DialogMode.INSERT, MacroType.URL);
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
