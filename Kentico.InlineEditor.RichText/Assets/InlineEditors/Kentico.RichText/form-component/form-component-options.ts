import { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

import { RichTextFormComponent } from "./rich-text-form-component";

const iframeStyle = ".ktc-macro { cursor: pointer; border: 1px solid black; border-radius: 3px; padding: 0 4px; background-color: #e5e5e5;} .ktc-macro:hover { -webkit-box-shadow: 0 0 3px rgba(0, 0, 0, 0.75); box-shadow: 0 0 3px rgba(0, 0, 0, 0.75);}";

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
    iframeStyle
});
