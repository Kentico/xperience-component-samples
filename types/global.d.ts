import { FroalaOptions } from "froala-editor/js/froala_editor.pkgd.min";

import { Kentico } from "./kentico";
import { HTMLRichTextEditorElement, RichTextInitEvent } from "./rich-text";
import { FORM_COMPONENT_INITIALIZATION_EVENT_NAME } from "@/Kentico.InlineEditor.RichText/Assets/InlineEditors/Kentico.RichText/constants";


declare global {
  interface Window {
    readonly kentico: Kentico;
    readonly customConfig: { [option: string]: Partial<FroalaOptions> };
  }

  interface HTMLElementTagNameMap {
    ".ktc-rich-text-wrapper": HTMLRichTextEditorElement;
  }

  interface DocumentEventMap {
    [FORM_COMPONENT_INITIALIZATION_EVENT_NAME]: RichTextInitEvent;
  }

  type Nullable<T> = T | null;

  // TEMP: Temporary jQuery type definition until Froala provides official type definition
  // see https://github.com/froala/wysiwyg-editor/issues/2369
  interface JQuery {}
  interface JQueryEventObject {}
  interface JQueryInputEventObject {}
  interface JQueryKeyEventObject {}
  interface JQueryMouseEventObject {}
}
