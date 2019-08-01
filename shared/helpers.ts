import { Mutable } from "@/types/global";
import { Kentico, PageBuilder } from "@/types/kentico";

/**
 * Exposes component API to the global namespace.
 * @param name Component name.
 * @param api API object to expose.
 */
export const exposeWidgetComponent = (name: string, api: object) => {
    const mutableWindow: Mutable<Window> = window as any;
    const mutableKentico: Mutable<Kentico> = mutableWindow.kentico = mutableWindow.kentico || {} as any;
    const mutablePageBuilder: Mutable<PageBuilder> = mutableKentico.pageBuilder = mutableKentico.pageBuilder || {} as any;

    mutablePageBuilder._widget = mutablePageBuilder._widget || {} as any;

    mutablePageBuilder._widget = {
        ...mutablePageBuilder._widget,
        [name]: {
            ...api,
        }
    }
}
