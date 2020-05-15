export type EditorType = "InlineEditor" | "FormComponent";

export interface RichTextFormComponentOptions {
    readonly editor: HTMLElement;
}

export type FroalaEventsOption = { [event: string]: Function };

export interface CodeMirrorElement extends HTMLElement {
    readonly CodeMirror: CodeMirror.Editor;
}