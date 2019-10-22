import { CustomPlugin } from "froala-editor/js/froala_editor.pkgd.min";
import { DialogMode } from "../plugin-types";

export interface MacrosPlugin extends CustomPlugin {
    readonly showActionsPopup: (macroElement: HTMLElement) => void;
    readonly hideActionsPopup: () => void;
    readonly showConfigurationPopup: (macroElement: DOMRect | ClientRect, mode: DialogMode, macroValue?: string, macroDefaultValue?: string) => void;
    readonly hideConfigurationPopup: () => void;
    readonly showConfigureUrlPopup: (relatedElementPosition: DOMRect | ClientRect, mode: DialogMode, macroValue: string, macroDefaultValue: string) => void;
    readonly showConfigureContextMacroPopup: (relatedElementPosition: DOMRect | ClientRect, mode: DialogMode, macroValue: string, macroDefaultValue: string) => void;
    readonly hidePopups: () => void;
}

export interface ContextMacros {
    [key: string]: string;
}

export enum MacroType {
    URL = "query",
    CONTEXT = "pattern"
}