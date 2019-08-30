import { CustomPlugin } from "froala-editor/js/froala_editor.pkgd.min";

export interface MacrosPlugin extends CustomPlugin {
    readonly showActionsPopup: (macroElement: HTMLElement) => void;
    readonly hideActionsPopup: () => void;
    readonly showConfigurationPopup: (macroElement: HTMLElement) => void;
    readonly hideConfigurationPopup: () => void;
}