/// <reference path="../../../../types/global.d.ts" />

import "./style.less";
import _debounce from "lodash/debounce";

window.kentico.pageBuilder.registerInlineEditor("Kentico.InlineEditor.VideoUrlEditor", {
    init({ editor, propertyName }) {
        const input = editor.querySelector("input");
        const errorLabel = editor.querySelector(".ktc-error-label");

        if ((input !== null) && (errorLabel !== null)) {
            input.addEventListener("invalid", (event) => {
                event.preventDefault();
                input.classList.add("ktc-error");
                errorLabel.classList.remove("ktc-hidden");
            });
            
            input.addEventListener("input", _debounce(() => {
                // Validate input & invoke property update event
                if (input.reportValidity()) {
                    const event = new CustomEvent("updateProperty", {
                        detail: {
                            value: input.value,
                            name: propertyName
                        }
                    });
            
                    editor.dispatchEvent(event);
                }
            }, 1000));
        }
    },
});
