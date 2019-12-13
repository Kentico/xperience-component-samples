/// <reference path="../../../../types/global.d.ts" />

import * as Froala from "froala-editor/js/froala_editor.pkgd.min";

import { initializeFroalaEditor, destroyFroalaEditor } from "./froala";

// Initialize custom plugins
window.addEventListener("DOMContentLoaded", () => {
    window.kentico.pageBuilder.richTextEditor?.plugins?.forEach((customPlugin) => {
        customPlugin(Froala);
    });
});

window.kentico.pageBuilder.registerInlineEditor("Kentico.InlineEditor.RichText", {
    init(options) {
        initializeFroalaEditor(options);
    },
    destroy(options) {
        // Destroy Froala editor when destroying inline editor
        destroyFroalaEditor(options);
    },
});