import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

/**
 * Returns native HTML element which is wrapped by provided jQuery object.
 * @param $element jQuery object which targets the element.
 * @returns HTML element or null.
 */
export const unwrapElement = <T extends HTMLElement>($element: JQuery): T | null => {
  if ($element) {
    return ($element as any)[0] as T;
  }

  return null;
}

export const getDialogElement = (editor: FroalaEditor, popupName: string) => {
  return unwrapElement(editor.popups.get(popupName));
};

const initializePopup = (editor: FroalaEditor, popupName: string, buttons: any[], customLayer?: string) => {
  // Popup buttons.
  let popup_buttons = "";

  // Create the list of buttons.
  if (buttons.length > 0) {
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

export const showPopup = (editor: FroalaEditor, popupName: string, relatedElementPosition: DOMRect | ClientRect, buttons: any[], customLayer?: string) => {
  // Get the popup object defined above.
  var $popup = editor.popups.get(popupName);

  // If popup doesn't exist then create it.
  // To improve performance it is best to create the popup when it is first needed
  // and not when the this is initialized.
  if (!$popup) {
    initializePopup(editor, popupName, buttons, customLayer);
  }

  // Set the this toolbar as the popup's container.
  editor.popups.setContainer(popupName, editor.$oel);

  // Compute the popup's position.
  const { top, left, width, height } = relatedElementPosition;
  const offsetLeft = left + width / 2;
  const offsetTop = top + window.pageYOffset;

  // Show the custom popup.
  // The button's outerHeight is required in case the popup needs to be displayed above it.
  editor.popups.show(popupName, offsetLeft, offsetTop, height);
}

export const bindFocusEventToInputs = (dialog: HTMLElement) => {
  const inputs = dialog.querySelectorAll<HTMLInputElement>(".fr-input-line input");

  inputs.forEach((inputEl) => {
    inputEl.addEventListener("focus", function () {
      if (!this.value) {
        this.classList.add("fr-not-empty");
      }
    });

    inputEl.addEventListener("blur", function () {
      if (!this.value) {
        this.classList.remove("fr-not-empty");
      }
    });
  });
}