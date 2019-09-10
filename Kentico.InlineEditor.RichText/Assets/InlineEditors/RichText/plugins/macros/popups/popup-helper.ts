import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import { DialogMode, MacroType } from "../macro-types";
import { getConfigureUrlParameterElement, getConfigureContextMacroElement } from "../macro-templates";
import { SWITCH_URL_TAB_COMMAND_NAME, SWITCH_MACRO_TAB_COMMAND_NAME } from "../macro-constants";

/**
 * Returns native HTML element which is wrapped by provided jQuery object.
 * @param $element jQuery object which targets the element.
 * @returns HTML element or null.
 */
const unwrapElement = <T extends HTMLElement>($element: JQuery): T | null => {
    if ($element) {
        return ($element as any)[0] as T;
    }

    return null;
}

export const getDialogElement = (editor: FroalaEditor, popupName: string) => {
    return unwrapElement(editor.popups.get(popupName));
};

export const showForm = (editor: FroalaEditor, popupName: string, mode: DialogMode = DialogMode.INSERT, macroType: MacroType, macroValue: string = "", macroDefaultValue: string = "") => {
    const dialog = getDialogElement(editor, popupName);
    if (dialog) {
        const container = dialog.querySelector<HTMLElement>(".ktc-configure-popup");
        let tabCommand = "";

        if (macroType === MacroType.URL) {
            container!.innerHTML = getConfigureUrlParameterElement(mode, macroValue, macroDefaultValue);
            tabCommand = SWITCH_URL_TAB_COMMAND_NAME;

        } else {
            container!.innerHTML = getConfigureContextMacroElement(mode, macroValue, macroDefaultValue);
            tabCommand = SWITCH_MACRO_TAB_COMMAND_NAME;
        }

        const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
        button!.classList.add("fr-active", "fr-selected");
    }
}

export function getShowDialog(popupName: string, buttons: any[], macroType: MacroType) {
    function initPopup(editor: FroalaEditor) {
        // Popup buttons.
        let popup_buttons = "";
    
        // Create the list of buttons.
        if (buttons.length >= 1) {
            popup_buttons += '<div class="fr-buttons">';
            popup_buttons += editor.button.buildList(buttons);
            popup_buttons += '</div>';
        }
    
        // Load popup template.
        const template = {
            buttons: popup_buttons,
            custom_layer: "<div class=\"ktc-configure-popup\"></div>",
        };
    
        // Create popup.
        var $popup = editor.popups.create(popupName, template);
    
        return $popup;
    }

    return function (this: FroalaEditor, relatedElement: DOMRect, mode: DialogMode, macroValue: string, macroDefaultValue: string) {
        // Get the popup object defined above.
        var $popup = this.popups.get(popupName);

        // If popup doesn't exist then create it.
        // To improve performance it is best to create the popup when it is first needed
        // and not when the this is initialized.
        if (!$popup) $popup = initPopup(this);

        // Set the this toolbar as the popup's container.
        this.popups.setContainer(popupName, this.$oel);

        // Compute the popup's position.
        const { top, left, width, height } = relatedElement;
        const offsetLeft = left + width / 2;
        const offsetTop = top + window.pageYOffset;

        // Show the custom popup.
        // The button's outerHeight is required in case the popup needs to be displayed above it.
        this.popups.show(popupName, offsetLeft, offsetTop, height);

        showForm(this, popupName, mode, macroType, macroValue, macroDefaultValue);
    };
}
