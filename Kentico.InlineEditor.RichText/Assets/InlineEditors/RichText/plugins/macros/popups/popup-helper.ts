import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

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

export const initializePopup = (editor: FroalaEditor, popupName: string, buttons: any[], customLayer?: string) => {
    // Popup buttons.
    let popup_buttons = "";

    // Create the list of buttons.
    if (buttons.length > 1) {
        popup_buttons += "<div class=\"fr-buttons\">";
        popup_buttons += editor.button.buildList(buttons);
        popup_buttons += "</div>";
    }

    // Load popup template.
    const template: any = {
        buttons: popup_buttons,
    };

    if (customLayer) {
        template["custom_layer"] = customLayer;
    }

    // Create popup.
    var $popup = editor.popups.create(popupName, template);

    return $popup;
}
