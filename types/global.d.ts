import { Kentico } from "./kentico";

declare global {
  interface Window {
    readonly kentico: Kentico;
  }

  // TEMP: Temporary jQuery type definition until Froala provides official type definition
  // see https://github.com/froala/wysiwyg-editor/issues/2369
  interface JQuery {}
  interface JQueryEventObject {}
  interface JQueryInputEventObject {}
  interface JQueryKeyEventObject {}
  interface JQueryMouseEventObject {}
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? Mutable<U>[] : Mutable<T[P]>
};

