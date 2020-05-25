import { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

import { InlineEditorOptions } from "@/types/kentico/inline-editors/inline-editor-options";
import { UPDATE_WIDGET_PROPERTY_EVENT_NAME } from "@/shared/constants";
import { replaceMacroElements } from "../plugins/macros/macro-services";
import { CodeMirrorElement } from "../types";

export const getInlineEditorOptions = (options: InlineEditorOptions): Partial<FroalaOptions> => ({
    events: {
        contentChanged() {
            updatePropertyValue(options.editor, options.propertyName, this.html.get());
        },
        ["commands.after"](cmd: string) {
            if (cmd === "html" && this.codeView.isActive()) {
                // Update the underlying Froala HTML when code is changed in CodeMirror
                const froalaWrapper = this.$wp[0];
                const codeMirrorInstance = froalaWrapper!.querySelector<CodeMirrorElement>(".CodeMirror");
                if (codeMirrorInstance) {
                    codeMirrorInstance.CodeMirror.on("change", function (instance: CodeMirror.Editor) {
                        updatePropertyValue(options.editor, options.propertyName, instance.getValue());
                    });
                }

                // Temporary, until https://github.com/froala/wysiwyg-editor/issues/3639 is fixed
                const froalaEditor = this.$oel[0];
                const codeViewExitButton = froalaEditor!.querySelector(".fr-btn.html-switch");
                codeViewExitButton!.innerHTML = this.button.build("html");
            }
        },
    }
});

const updatePropertyValue = (inlineEditor: HTMLElement, propertyName: string, newValue: string) => {
    const event = new CustomEvent(UPDATE_WIDGET_PROPERTY_EVENT_NAME, {
        detail: {
            name: propertyName,
            value: replaceMacroElements(newValue),
            refreshMarkup: false
        }
    });

    inlineEditor.dispatchEvent(event);
};