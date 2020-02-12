/// <reference path="../../../../types/global.d.ts" />

import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";

import { initializeFroalaEditor, destroyFroalaEditor } from "./froala";
import { insertImageCommand, imageReplaceCommand } from "./commands";

// Initialize plugins
window.addEventListener("DOMContentLoaded", () => {
    // Override default e-mail regex
    FroalaEditor.MAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    Froala.RegisterCommand("insertImage", insertImageCommand);
    Froala.RegisterCommand("imageReplace", imageReplaceCommand);
    Froala.RegisterQuickInsertButton("image", insertImageCommand);

    window.kentico.pageBuilder.richTextEditor?.plugins?.forEach((customPlugin) => {
        customPlugin(FroalaEditor);
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