import { CustomPlugin } from "froala-editor/js/froala_editor.pkgd.min";

export interface MacrosPlugin extends CustomPlugin {
    readonly showPopup: (macroElement: HTMLElement) => void;
    readonly hidePopup: () => void;
}