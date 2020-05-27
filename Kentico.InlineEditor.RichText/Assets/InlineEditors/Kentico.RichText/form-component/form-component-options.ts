import FroalaEditor, { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

import { FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME } from "../constants";
import { CodeMirrorElement } from "../types";
import { replaceMacroElements } from "../plugins/macros/macro-services";

const iframeStyle = ".ktc-macro { cursor: pointer; border: 1px solid black; border-radius: 3px; padding: 0 4px; background-color: #e5e5e5;} .ktc-macro:hover { -webkit-box-shadow: 0 0 3px rgba(0, 0, 0, 0.75); box-shadow: 0 0 3px rgba(0, 0, 0, 0.75);}";

export const getFormComponentOptions = (editor: HTMLElement): Partial<FroalaOptions> => ({
    toolbarInline: false,
    iframe: true,
    zIndex: 10205,
    events: {
        initialized() {
            ensureFormComponentInitialization(this, editor);
        }
    },
    iframeStyle
});

const ensureFormComponentInitialization = (froalaEditor: FroalaEditor, formComponent: HTMLElement) => {
    // Ensure save button
    const saveButton = document.createElement("button");
    saveButton.textContent = window.kentico.localization.strings["Kentico.FormComponent.RichText.ApplyButton"];
    saveButton.classList.add("ktc-btn-rich-text-save");
    saveButton.addEventListener("click", () => {
        handleFullscreenExit(froalaEditor, formComponent);
        saveButton.remove();
    });
    document.body.appendChild(saveButton);

    // Ensure fullscreen mode
    document.body.classList.add("ktc-rich-text-form-component--fullscreen");
    froalaEditor.fullscreen.toggle();
    // Set initial iframe height which ensures scrollbars if the content overflows the editor's size
    froalaEditor.$iframe[0]!.style.height = `${froalaEditor.el.clientHeight}px`;
    froalaEditor.events.focus();
};

const handleFullscreenExit = (froalaEditor: FroalaEditor, formComponent: HTMLElement) => {
    const valueEl = formComponent.querySelector<HTMLInputElement>(`.${FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME}`);
    const editorValue = froalaEditor.codeView.isActive()
        ? froalaEditor.$wp.find<CodeMirrorElement>(".CodeMirror")[0].CodeMirror.getValue()
        : froalaEditor.html.get();
    valueEl!.value = replaceMacroElements(editorValue);
    valueEl?.dispatchEvent(new Event("change"));
    froalaEditor.fullscreen.toggle();
    froalaEditor.destroy();
    const richTextWrapper = froalaEditor.$oel[0];
    richTextWrapper.innerHTML = "";
    formComponent.querySelector("[data-inline-editor]")?.appendChild(richTextWrapper);
    document.body.classList.remove("ktc-rich-text-form-component--fullscreen");
};