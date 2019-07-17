import { KenticoComponents } from "./kentico-components";
import { Kentico } from "./kentico";

declare global {
  interface Window {
    readonly kentico: Kentico;
    readonly kenticoComponents: KenticoComponents;
  }
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? Mutable<U>[] : Mutable<T[P]>
};
