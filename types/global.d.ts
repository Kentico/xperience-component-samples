import { Kentico } from "./kentico";

declare global {
  interface Window {
    readonly kentico: Kentico;
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
