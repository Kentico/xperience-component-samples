import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

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