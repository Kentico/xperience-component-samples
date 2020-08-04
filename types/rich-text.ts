import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";
import { RichTextInitEventParams } from "@/Kentico.InlineEditor.RichText/Assets/InlineEditors/Kentico.RichText/types";

interface HTMLRichTextEditorElementDOMStringMap extends DOMStringMap {
    readonly richTextEditorLicense: string;
    readonly getLinkMetadataEndpointUrl: string;
    readonly richTextEditorConfiguration: string;
    readonly contextMacros?: string;
}
  
export interface HTMLRichTextEditorElement extends HTMLElement {
    readonly "data-froala.editor"?: FroalaEditor;
    readonly dataset: HTMLRichTextEditorElementDOMStringMap;
}

export interface RichTextInitEvent extends CustomEvent<RichTextInitEventParams> {
    readonly target: HTMLElement;
}