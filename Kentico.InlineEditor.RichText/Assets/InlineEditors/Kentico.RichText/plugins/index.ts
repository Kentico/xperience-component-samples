import * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import { insertImageCommand, imageReplaceCommand } from "../commands";
import { initializeMacroPlugin } from "./macros";
import { initializeLinkPlugin } from "./links";

let pluginsInitialized = false;

export const initializePlugins = (element: HTMLElement) => {
    if (!pluginsInitialized) {
        pluginsInitialized = true;

        Froala.RegisterCommand("insertImage", insertImageCommand);
        Froala.RegisterCommand("imageReplace", imageReplaceCommand);
        Froala.RegisterQuickInsertButton("image", insertImageCommand);
        
        initializeMacroPlugin(Froala, element);
        initializeLinkPlugin(Froala, element);
    }
}