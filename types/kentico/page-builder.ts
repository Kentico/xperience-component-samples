import { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

import { InlineEditor } from "./inline-editors/inline-editor";

interface RichTextEditorConfiguration {
    readonly froalaOptions: Partial<FroalaOptions>;
}

interface RichTextEditorConfigurations {
    readonly [configurationIdentifier: string]: RichTextEditorConfiguration;
}

interface ComponentsOptions {
    readonly [componentIdentifier: string]: RichTextEditorConfigurations;
}

export interface PageBuilder {
    /**
     * Registers inline editor into page builder.
     */
    readonly registerInlineEditor: (name: string, definition: InlineEditor) => void;

    /**
     * Custom component options.
     */
    readonly componentOptions?: ComponentsOptions;
}