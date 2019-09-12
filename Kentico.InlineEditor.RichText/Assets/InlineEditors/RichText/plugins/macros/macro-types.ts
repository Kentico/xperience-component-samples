import { CustomPlugin } from "froala-editor/js/froala_editor.pkgd.min";

export interface MacrosPlugin extends CustomPlugin {
    readonly showActionsPopup: (macroElement: HTMLElement) => void;
    readonly hideActionsPopup: () => void;
    readonly showConfigurationPopup: (macroElement: DOMRect | ClientRect, mode: DialogMode, macroValue?: string, macroDefaultValue?: string) => void;
    readonly hideConfigurationPopup: () => void;
    readonly showConfigureUrlPopup: (relatedElementPosition: DOMRect | ClientRect, mode: DialogMode, macroValue: string, macroDefaultValue: string) => void;
    readonly showConfigureContextMacroPopup: (relatedElementPosition: DOMRect | ClientRect, mode: DialogMode, macroValue: string, macroDefaultValue: string) => void;
    readonly hidePopups: () => void;
}

export enum DialogMode {
    INSERT,
    UPDATE
}

export enum MacroType {
    URL = "url",
    CONTEXT = "context"
}

export enum ContextMacro {
    FIRST_NAME = "ContactManagementContext.CurrentContact.ContactFirstName",
    LAST_NAME = "ContactManagementContext.CurrentContact.ContactLastName",
    FULL_NAME = "ContactManagementContext.CurrentContact.ContactDescriptiveName"
}

export type MacroElementTemplateResolver = (macroType: MacroType, macroValue: string, macroDefaultValue: string, macroDisplayValue: string) => string;