import { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

import { Froala } from "./";
import { InlineEditor } from "./inline-editors/inline-editor";

interface RichTextEditorConfigurations {
    readonly [configurationName: string]: Partial<FroalaOptions>;
}

interface RichTextEditor {
    readonly configurations?: RichTextEditorConfigurations;
    readonly plugins?: Array<(froala: Froala) => void>;
}

export interface PageBuilder {
    /**
     * Registers inline editor into page builder.
     */
    readonly registerInlineEditor: (name: string, definition: InlineEditor) => void;

    /**
     * Rich text editor.
     */
    readonly richTextEditor?: RichTextEditor;
}