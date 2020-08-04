import { CustomPlugin, Position } from "froala-editor/js/froala_editor.pkgd.min";
import { DialogMode } from "../plugin-types";

export interface MacrosPlugin extends CustomPlugin {
    readonly getActiveMacro: () => HTMLInputElement | null;
    readonly showActionsPopup: (macroElement: Element) => void;
    readonly hideActionsPopup: () => void;
    readonly showConfigurationPopup: (mode: DialogMode, getMacroElement?: () => Element, macroValue?: string, macroDefaultValue?: string) => void;
    readonly hideConfigurationPopup: () => void;
    readonly showConfigureUrlPopup: (mode: DialogMode, getMacroElement: () => Element, macroValue: string, macroDefaultValue: string) => void;
    readonly showConfigureContextMacroPopup: (mode: DialogMode, getMacroElement: () => Element, macroValue: string, macroDefaultValue: string) => void;
    readonly hidePopups: () => void;
}

export interface ContextMacros {
    [key: string]: string;
}

export enum MacroType {
    URL = "query",
    CONTEXT = "pattern"
}