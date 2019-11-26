import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";
import "./style.less";

import { imageReplaceCommand, insertImageCommand } from "./commands";
import { initializeMacroPlugin } from "./plugins/macros";
import { initializeLinkPlugin } from "./plugins/links";
import { getEvents } from "./froala-events";
import { getFroalaOptions } from "./froala-options";

export const initializeFroalaEditor = (element: HTMLElement, inlineEditor: HTMLElement, propertyName: string, propertyValue: string) => {
    Froala.RegisterCommand("insertImage", insertImageCommand);
    Froala.RegisterCommand("imageReplace", imageReplaceCommand);
    Froala.RegisterQuickInsertButton("image", insertImageCommand);

    initializeMacroPlugin(Froala, element);
    initializeLinkPlugin(Froala, element);

    let customOptions: Partial<Froala.FroalaOptions> = {};
    const configurationIdentifier = element.dataset.richTextEditorConfiguration;
    if (configurationIdentifier && typeof window.customConfig === "object") {
        customOptions = window.customConfig[configurationIdentifier];
    }
    const key = element.dataset.richTextEditorLicense as string;
    const events = getEvents(inlineEditor, propertyName, propertyValue, customOptions);
    const options = getFroalaOptions(key, events, customOptions);

    new FroalaEditor(element, options);
}

export const destroyFroalaEditor = (element: HTMLElement) => {
    const froala = (element as any)["data-froala.editor"];

    if (froala) {
        froala.destroy();
    }
}
