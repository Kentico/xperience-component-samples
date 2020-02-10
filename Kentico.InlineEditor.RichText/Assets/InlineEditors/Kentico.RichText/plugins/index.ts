import * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import { initializeMacroPlugin } from "./macros";
import { initializeLinkPlugin } from "./links";

let pluginsInitialized = false;

export const initializePlugins = (element: HTMLElement) => {
    if (!pluginsInitialized) {
        pluginsInitialized = true;
        
        initializeMacroPlugin(Froala, element);
        initializeLinkPlugin(Froala, element);
    }
}