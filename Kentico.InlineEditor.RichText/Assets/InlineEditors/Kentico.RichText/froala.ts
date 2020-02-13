import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";
import "./style.less";

import { InlineEditorOptions } from "@/types/kentico/inline-editors/inline-editor-options";
import { getEvents } from "./froala-events";
import { getFroalaOptions } from "./froala-options";

const RICH_TEXT_WRAPPER_SELECTOR = ".ktc-rich-text-wrapper";
let configurationCollected = false;

export const initializeFroalaEditor = ({ editor, propertyName, propertyValue }: InlineEditorOptions) => {
    const element = editor.querySelector<HTMLElement>(RICH_TEXT_WRAPPER_SELECTOR);

    if (!element) {
        return;
    }

    const config = getConfigurationFromDataAttributes(element);
    Object.assign(Froala.DEFAULTS, config);

    const customOptions = getCustomOptions(element);
    const events = getEvents(editor, propertyName, propertyValue, customOptions);
    const options = getFroalaOptions(events, customOptions);

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

const getConfigurationFromDataAttributes = (element: HTMLElement) => {
    if (!configurationCollected) {
        configurationCollected = true;

        return {
            contextMacros: element.dataset.contextMacros,
            getLinkMetadataEndpointUrl: element.dataset.getLinkMetadataEndpointUrl,
            licenseKey: element.dataset.richTextEditorLicense,
        };
    }
}