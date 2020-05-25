export type FroalaEventsOption = { [event: string]: Function };

export interface CodeMirrorElement extends HTMLElement {
    readonly CodeMirror: CodeMirror.Editor;
}

export interface RichTextInitEventParams {
    html: string;
    applicationPath: string;
};
