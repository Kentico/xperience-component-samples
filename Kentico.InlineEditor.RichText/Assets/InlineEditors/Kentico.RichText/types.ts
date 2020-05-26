import { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

export type FroalaEventsOption = { [event: string]: Function };

export interface CodeMirrorElement extends HTMLElement {
    readonly CodeMirror: CodeMirror.Editor;
}

export interface RichTextInitEventParams {
    html: string;
};

export type FroalaOptionsModifier = (froalaOptions: Partial<FroalaOptions>) => void;
