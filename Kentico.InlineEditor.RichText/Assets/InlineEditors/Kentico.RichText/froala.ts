import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";
import "./style.less";

import { InlineEditorOptions } from "@/types/kentico/inline-editors/inline-editor-options";
import { imageReplaceCommand, insertImageCommand } from "./commands";
import { initializeMacroPlugin } from "./plugins/macros";
import { initializeLinkPlugin } from "./plugins/links";
import { getEvents } from "./froala-events";
import { getFroalaOptions } from "./froala-options";

const RICH_TEXT_WRAPPER_SELECTOR = ".ktc-rich-text-wrapper";

export const initializeFroalaEditor = ({ editor, propertyName, propertyValue }: InlineEditorOptions) => {
    const element = editor.querySelector<HTMLElement>(RICH_TEXT_WRAPPER_SELECTOR);

    if (!element) {
        return;
    }

    Froala.RegisterCommand("insertImage", insertImageCommand);
    Froala.RegisterCommand("imageReplace", imageReplaceCommand);
    Froala.RegisterQuickInsertButton("image", insertImageCommand);

    initializeMacroPlugin(Froala, element);
    initializeLinkPlugin(Froala, element);
    
    const customOptions = getCustomOptions(element, editor);
    const key = element.dataset.richTextEditorLicense as string;
    const events = getEvents(editor, propertyName, propertyValue, customOptions);
    const options = getFroalaOptions(key, events, customOptions);

    new FroalaEditor(element, options);
}

export const destroyFroalaEditor = ({ editor }: InlineEditorOptions) => {
    const richTextWrapper = editor.querySelector<HTMLElement>(RICH_TEXT_WRAPPER_SELECTOR);

    if (richTextWrapper) {
        const froala = (richTextWrapper as any)["data-froala.editor"];
    
        if (froala) {
            froala.destroy();
        }
    }
}

const getCustomOptions = (richTextWrapper: HTMLElement, inlineEditor: HTMLElement): Partial<Froala.FroalaOptions> => {
    const configurationIdentifier = richTextWrapper.dataset.richTextEditorConfiguration!;
    const componentIdentifier = inlineEditor.dataset.inlineEditor!;
    const customConfiguration = window.kentico.pageBuilder.componentOptions?.[componentIdentifier]?.[configurationIdentifier];

    return (typeof customConfiguration?.froalaOptions === "object") ? customConfiguration.froalaOptions : {};
}
