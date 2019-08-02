/// <reference path="../../../../types/global.d.ts" />

import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";

const RICH_TEXT_WRAPPER_SELECTOR = ".ktc-rich-text-wrapper";

window.kentico.pageBuilder.registerInlineEditor("Kentico.InlineEditor.RichText", {
    init({ editor, propertyName }) {
        const richTextWrapper = editor.querySelector(RICH_TEXT_WRAPPER_SELECTOR);

        new FroalaEditor(richTextWrapper, {
            events: {
                contentChanged() {
                    const event = new CustomEvent("updateProperty", {
                        detail: {
                            name: propertyName,
                            value: this.html.get(),
                            refreshMarkup: false
                        }
                    });

                    editor.dispatchEvent(event);
                },
            },
        });
    },
    destroy({ editor }) {
        const richTextWrapper = editor.querySelector<any>(RICH_TEXT_WRAPPER_SELECTOR);
        const froala = richTextWrapper["data-froala.editor"];
        
        if (froala) {
            // Destroy Froala editor when destroying inline editor
            froala.destroy();
        }
    }
});