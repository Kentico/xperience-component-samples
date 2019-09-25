import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";

import * as constants from "./macro-constants";
import { getMacroEditModeElement } from "./macro-templates";
import { DialogMode, MacroType } from "./macro-types";
import { getMacroDisplayName, getString } from "./macro-helpers";
import { showForm } from "./popups";
import { FroalaIcon } from "../../froala-icon";
import { FroalaCommand } from "../../froala-command";
import { getDialogElement } from "../popup-helper";

// Open insert macro popup

let defaultValueText: string;

const openInsertMacroPopupCommandIcon = new FroalaIcon(constants.OPEN_INSERT_MACRO_POPUP_COMMAND_NAME, { PATH: constants.ICON_MACRO, template: "svg" });
const openInsertMacroPopupCommand = new FroalaCommand(constants.OPEN_INSERT_MACRO_POPUP_COMMAND_NAME, {
    title: getString("Command.InsertDynamicText"),
    icon: constants.OPEN_INSERT_MACRO_POPUP_COMMAND_NAME,
    focus: false,
    undo: false,
    plugin: constants.MACROS_PLUGIN_NAME,
    refreshAfterCallback: true,
    callback(this: FroalaEditor) {
        this.selection.save();
        defaultValueText = this.selection.text();
        this.kenticoMacroPlugin.showConfigurationPopup(this.position.getBoundingRect(), DialogMode.INSERT, undefined, defaultValueText);
    }
}, openInsertMacroPopupCommandIcon);

// Insert macro

const insertMacroCommandParameters: RegisterCommandParameters = {
    title: "",
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor, commandName: string) {
        this.selection.restore();
        const popupElement = getDialogElement(this, constants.CONFIGURATION_POPUP_NAME);

        if (popupElement) {
            this.undo.saveStep();
            const form = popupElement.querySelector<HTMLFormElement>("#ktc-form");
            const formData = new FormData(form!);
            const macroType = commandName === constants.INSERT_URL_MACRO_COMMAND_NAME ? MacroType.URL : MacroType.CONTEXT;
            const contextMacros = this.opts.contextMacros;

            let macroValue = "";
            let macroDisplayValue = "";

            if (macroType === MacroType.URL) {
                const urlParameterName = formData.get("urlParameterName") as string;
                macroValue = encodeURI(urlParameterName);
                macroDisplayValue = getMacroDisplayName(contextMacros, urlParameterName);
            } else if (macroType === MacroType.CONTEXT) {
                macroValue = formData.get("contextMacroType") as string;
                macroDisplayValue = getMacroDisplayName(contextMacros, macroValue);
            }

            const macroDefaultValue = formData.get("defaultText") as string;

            if (macroValue) {
                const macroElement = getMacroEditModeElement(macroType, macroValue, macroDefaultValue, macroDisplayValue);
                this.html.insert(macroElement);
            }

            this.toolbar.hide();
            this.kenticoMacroPlugin.hideConfigurationPopup();
        }
    }
}
const insertMacroCommand = new FroalaCommand(constants.INSERT_MACRO_COMMAND_NAME, insertMacroCommandParameters);
const insertUrlMacroCommand = new FroalaCommand(constants.INSERT_URL_MACRO_COMMAND_NAME, insertMacroCommandParameters);
const insertContextMacroCommand = new FroalaCommand(constants.INSERT_CONTEXT_MACRO_COMMAND_NAME, insertMacroCommandParameters);

// Update macro

const updateMacroCommandParameters: RegisterCommandParameters = {
    title: "",
    focus: false,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor, commandName) {
        const macroElement = this.el.querySelector<HTMLInputElement>(`.${constants.MACRO_ACTIVE_CLASS}`);
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
                macroValue: encodeURI(macroValue),
                macroDefaultValue: formData.get("defaultText"),
            };

            if (data.macroValue) {
                macroElement.value = getMacroDisplayName(this.opts.contextMacros, macroValue);
                Object.assign(macroElement.dataset, data);
            }
            
            this.kenticoMacroPlugin.hidePopups();
        }
    }
}
const updateUrlMacroCommand = new FroalaCommand(constants.UPDATE_URL_MACRO_COMMAND_NAME, updateMacroCommandParameters);
const updateContextMacroCommand = new FroalaCommand(constants.UPDATE_CONTEXT_MACRO_COMMAND_NAME, updateMacroCommandParameters);

// Remove macro

const removeMacroCommand = new FroalaCommand(constants.REMOVE_MACRO_COMMAND_NAME, {
    title: getString("Command.RemoveMacro"),
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
});

// Configure macro

const configureMacroCommandIcon = new FroalaIcon(constants.CONFIGURE_MACRO_COMMAND_NAME, { NAME: "cog-wheel", SVG_KEY: "cogs" });
const configureMacroCommand = new FroalaCommand(constants.CONFIGURE_MACRO_COMMAND_NAME, {
    title: getString("Command.ConfigureMacro"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        const macroEl = this.el.querySelector<HTMLElement>(`.${constants.MACRO_ACTIVE_CLASS}`);
        if (macroEl) {
            const dataset = macroEl.dataset as { macroType: MacroType, macroValue: string, macroDefaultValue: string };
            const { macroValue, macroDefaultValue, macroType } = dataset;
            const macroElementRect = macroEl.getBoundingClientRect();

            if (macroType === MacroType.URL) {
                this.kenticoMacroPlugin.showConfigureUrlPopup(macroElementRect, DialogMode.UPDATE, macroValue, macroDefaultValue);
            } else {
                this.kenticoMacroPlugin.showConfigureContextMacroPopup(macroElementRect, DialogMode.UPDATE, macroValue, macroDefaultValue);
            }
        }
    }
}, configureMacroCommandIcon);

// Open macro tab command

const openMacroTabCommandIcon = new FroalaIcon("macro", { PATH: constants.ICON_CONTACT_ATTRIBUTES, template: "svg" });
const openMacroTabCommand = new FroalaCommand(constants.SWITCH_MACRO_TAB_COMMAND_NAME, {
    title: getString("Command.ContactAttribute"),
    icon: "macro",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showForm(this, constants.CONFIGURATION_POPUP_NAME, DialogMode.INSERT, MacroType.CONTEXT, undefined, defaultValueText);
    }
}, openMacroTabCommandIcon);

// Open query tab

const openQueryTabCommandIcon = new FroalaIcon("queryString", { PATH: constants.ICON_URL_PARAM, template: "svg" });
const openQueryTabCommand = new FroalaCommand(constants.SWITCH_URL_TAB_COMMAND_NAME, {
    title: getString("Command.UrlParameter"),
    icon: "queryString",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        showForm(this, constants.CONFIGURATION_POPUP_NAME, DialogMode.INSERT, MacroType.URL, undefined, defaultValueText);
    }
}, openQueryTabCommandIcon);

// Close configure popup

const closeConfigurePopupCommandIcon = new FroalaIcon("popupConfigureClose", { NAME: "arrow-left", SVG_KEY: "back" });
const closeConfigurePopupCommand = new FroalaCommand(constants.CLOSE_CONFIGURE_POPUP_COMMAND_NAME, {
    title: getString("Command.PopupBack"),
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        this.kenticoMacroPlugin.hideConfigurationPopup();
    }
}, closeConfigurePopupCommandIcon);

export const macroCommands = [
    openInsertMacroPopupCommand,
    removeMacroCommand,
    configureMacroCommand,
    closeConfigurePopupCommand,
    openMacroTabCommand,
    openQueryTabCommand,
    insertMacroCommand,
    insertUrlMacroCommand,
    insertContextMacroCommand,
    updateUrlMacroCommand,
    updateContextMacroCommand,
]
