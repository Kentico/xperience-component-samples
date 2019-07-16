import { KenticoComponents } from "./kentico-components";
import { Kentico } from "./kentico";

declare global {
  interface Window {
    kentico: Kentico;
    kenticoComponents: KenticoComponents;
  }
}
