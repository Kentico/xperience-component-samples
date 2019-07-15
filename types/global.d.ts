import { KenticoComponents } from "./kenticoComponents";
import { Kentico } from "./kentico";

declare global {
  interface Window {
    kentico: Kentico;
    kenticoComponents: KenticoComponents;
  }
}
