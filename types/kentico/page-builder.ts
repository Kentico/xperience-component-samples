import { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

import { InlineEditor } from "./inline-editors/inline-editor";

interface RichTextEditorConfiguration {
    readonly froalaOptions: Partial<FroalaOptions>;
}

interface RichTextEditorConfigurations {
    readonly [configurationName: string]: RichTextEditorConfiguration;
}

interface RichTextEditor {
    readonly configurations?: RichTextEditorConfigurations;
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