import { InlineEditorOptions } from "./inline-editor-options";

export interface InlineEditor {
    /**
     * Inline editor initialization lifecycle callback.
     */
    readonly init: (options: InlineEditorOptions) => void;

    /**
     * Inline editor destroy lifecycle callback.
     */
    readonly destroy?: (options: InlineEditorOptions) => void;

    /**
     * Inline editor drag start lifecycle callback.
     */
    readonly dragStart?: (options: InlineEditorOptions) => void;

    /**
     * Inline editor drop lifecycle callback.
     */
    readonly drop?: (options: InlineEditorOptions) => void;
}