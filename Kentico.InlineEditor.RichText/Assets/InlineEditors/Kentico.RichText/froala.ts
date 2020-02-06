import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";
import "./style.less";

import { InlineEditorOptions } from "@/types/kentico/inline-editors/inline-editor-options";
import { getEvents } from "./froala-events";
import { getFroalaOptions } from "./froala-options";
import { initializePlugins } from "./plugins";

const RICH_TEXT_WRAPPER_SELECTOR = ".ktc-rich-text-wrapper";

export const initializeFroalaEditor = ({ editor, propertyName, propertyValue }: InlineEditorOptions) => {
    const element = editor.querySelector<HTMLElement>(RICH_TEXT_WRAPPER_SELECTOR);

    if (!element) {
        return;
    }

    // Override default e-mail regex
    FroalaEditor.MAIL_REGEX = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

    initializePlugins(element);

    const key = element.dataset.richTextEditorLicense as string;
    const customOptions = getCustomOptions(element);
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

const getCustomOptions = (richTextWrapper: HTMLElement): Partial<Froala.FroalaOptions> => {
    const configurationName = richTextWrapper.dataset.richTextEditorConfiguration!;
    const customConfiguration = window.kentico.pageBuilder.richTextEditor?.configurations?.[configurationName];

    return (typeof customConfiguration === "object") ? customConfiguration : {};
}
