import { initializeMacroPlugin } from "./macros";
import { initializeLinkPlugin } from "./links";
import { initializeImagePlugin } from "./images";

export const initializePlugins = () => {
    initializeImagePlugin();
    initializeMacroPlugin();
    initializeLinkPlugin();
}