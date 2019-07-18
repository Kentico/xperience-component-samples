import { Mutable } from "@/types/global";
import { KenticoComponents } from "@/types/kentico-components";

/**
 * Exposes component API to the global namespace.
 * @param name Component name.
 * @param api API object to expose.
 */
export const exposeWidgetComponent = (name: string, api: object) => {
    const mutableWindow: Mutable<Window> = window as any;
    const kenticoComponents: Mutable<KenticoComponents> = mutableWindow.kenticoComponents = mutableWindow.kenticoComponents || {} as any;
    kenticoComponents.widgets = kenticoComponents.widgets || {} as any;

    kenticoComponents.widgets = {
        ...kenticoComponents.widgets,
        [name]: {
            ...api,
        }
    }
}
