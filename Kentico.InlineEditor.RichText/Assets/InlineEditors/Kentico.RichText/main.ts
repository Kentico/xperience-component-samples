/// <reference path="../../../../types/global.d.ts" />

import { initializeFroalaEditor, destroyFroalaEditor } from "./froala";

const RICH_TEXT_WRAPPER_SELECTOR = ".ktc-rich-text-wrapper";

window.kentico.pageBuilder.registerInlineEditor("Kentico.InlineEditor.RichText", {
    init({ editor, propertyName, propertyValue }) {
        const richTextWrapper = editor.querySelector<HTMLElement>(RICH_TEXT_WRAPPER_SELECTOR);

        if (richTextWrapper) {
            initializeFroalaEditor(richTextWrapper, editor, propertyName, propertyValue);
        }
    },
    destroy({ editor }) {
        const richTextWrapper = editor.querySelector<HTMLElement>(RICH_TEXT_WRAPPER_SELECTOR);

        if (richTextWrapper) {
            // Destroy Froala editor when destroying inline editor
            destroyFroalaEditor(richTextWrapper);
        }
    }
});