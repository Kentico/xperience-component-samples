import { InlineEditor } from "./inline-editors/inline-editor";

export interface PageBuilder {
    /**
     * Registers inline editor into page builder.
     */
    readonly registerInlineEditor: (name: string, definition: InlineEditor) => void;
}