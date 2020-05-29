import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { unwrapElement } from "../helpers";
import { DialogMode } from "./plugin-types";

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
  return editor.popups.create(popupName, template);
}

export const showPopup = (
  editor: FroalaEditor,
  popupName: string,
  relatedElementPosition: DOMRect | ClientRect,
  buttons: any[],
  dialogMode: DialogMode,
  popupWidth: number,
  customLayer?: string
) => {
  // Get the popup object defined above.
  const $popup = editor.popups.get(popupName);

  // If popup doesn't exist then create it.
  // To improve performance it is best to create the popup when it is first needed
  // and not when the this is initialized.
  if (!$popup) {
    initializePopup(editor, popupName, buttons, customLayer);
  }

  // Set the the body element as the popup's container.
  const container = dialogMode === DialogMode.INSERT ? editor.$tb || editor.$sc : editor.$sc;
  editor.popups.refresh(popupName);
  editor.popups.setContainer(popupName, container);

  // Compute the popup's position.
  const { top, left, width, height } = relatedElementPosition;
  const offsetLeft = left + (width / 2) - (popupWidth / 2);
  const offsetTop = top + window.pageYOffset + height;

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