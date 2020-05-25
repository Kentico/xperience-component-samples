/// <reference path="../../../../types/global.d.ts" />

import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";

import { initializeFroalaEditor, destroyFroalaEditor } from "./froala";
import { initializePlugins } from "./plugins";
import { FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME, FORM_COMPONENT_INITIALIZATION_EVENT_NAME } from "./constants";
import { getPreviewIframeHtml } from "./form-component/form-component-templates";

// Initialize plugins
window.addEventListener("DOMContentLoaded", () => {
    // Override default e-mail regex
    FroalaEditor.MAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    // Hide specific buttons in the built-in plugins
    const videoInsertButtons = Froala.DEFAULTS.videoInsertButtons || [];
    delete videoInsertButtons[videoInsertButtons.indexOf("videoUpload")];

    initializePlugins();

    window.kentico.pageBuilder.richTextEditor?.plugins?.forEach((customPlugin) => {
        customPlugin(FroalaEditor);
    });
});

document.addEventListener(FORM_COMPONENT_INITIALIZATION_EVENT_NAME, ({ target: editor, detail: data  }) => {
    const editButton = editor.querySelector<HTMLButtonElement>(".ktc-btn");
    editButton?.addEventListener("click", () => {
        initializeFroalaEditor({ editor }, "FormComponent");
    });

    const valueEl = document.querySelector<HTMLInputElement>(`.${FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME}`)!;
    valueEl.value = data.html;
    valueEl.addEventListener("change", () => {
        const iframeEl = editor.querySelector<HTMLIFrameElement>("iframe")!;
        iframeEl.srcdoc = getPreviewIframeHtml(valueEl.value);

        if (valueEl.value === "") {
            editor.classList.add("ktc-rich-text-form-component--empty")
        } else {
            editor.classList.remove("ktc-rich-text-form-component--empty");
        }
    });
    valueEl.dispatchEvent(new Event("change"));
});

window.kentico.pageBuilder.registerInlineEditor("Kentico.InlineEditor.RichText", {
    init(options) {
        initializeFroalaEditor(options, "InlineEditor");
    },
    destroy(options) {
        // Destroy Froala editor when destroying inline editor
        destroyFroalaEditor(options);
    },
});