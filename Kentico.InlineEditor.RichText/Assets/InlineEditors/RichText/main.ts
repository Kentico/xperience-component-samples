/// <reference path="../../../../types/global.d.ts" />

import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";

window.kentico.pageBuilder.registerInlineEditor("Kentico.InlineEditor.RichText", {
    init({ editor, propertyName }) {
        const richTextWrapper = editor.querySelector(".ktc-rich-text-wrapper");

        const froala = new FroalaEditor(richTextWrapper, {
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
});