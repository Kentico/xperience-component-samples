/// <reference path="../../../../types/global.d.ts" />

import { initializeFroalaEditor, destroyFroalaEditor } from "./froala";

window.kentico.pageBuilder.registerInlineEditor("Kentico.InlineEditor.RichText", {
    init(options) {
        initializeFroalaEditor(options);
    },
    destroy(options) {
        // Destroy Froala editor when destroying inline editor
        destroyFroalaEditor(options);
    },
});