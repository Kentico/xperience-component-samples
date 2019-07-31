import { Kentico } from "./kentico";

declare global {
  interface Window {
    readonly kentico: Kentico;
  }
}

type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? Mutable<U>[] : Mutable<T[P]>
};
