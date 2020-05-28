import { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

import { RichTextFormComponent } from "./rich-text-form-component";

export const getIframeStyle = (): string => {
    return require("../style-macro.template.css")();
}

export const getFormComponentOptions = (editor: HTMLElement): Partial<FroalaOptions> => ({
    toolbarInline: false,
    iframe: true,
    zIndex: 10205,
    events: {
        initialized() {
            const richText = new RichTextFormComponent(this, editor);
            richText.initialize();
        }
    },
    iframeStyle: getIframeStyle()
});
