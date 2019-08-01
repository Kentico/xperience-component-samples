/// <reference path="../../../../types/global.d.ts" />

import FroalaEditor from "froala-editor";
import "froala-editor/css/froala_editor.css";

window.kentico.pageBuilder.registerInlineEditor("Kentico.InlineEditor.RichText", {
    init({ editor, propertyName, propertyValue }) {
        const richTextWrapper = editor.querySelector(".ktc-rich-text-wrapper");

        new FroalaEditor(richTextWrapper, {
        });
    },
});