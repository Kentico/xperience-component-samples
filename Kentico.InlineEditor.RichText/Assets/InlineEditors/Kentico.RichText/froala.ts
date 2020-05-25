import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";
import "./style.less";

import { InlineEditorOptions } from "@/types/kentico/inline-editors/inline-editor-options";
import { HTMLRichTextEditorElement } from "@/types/rich-text";
import { getEvents } from "./froala-events";
import { getFroalaOptions } from "./froala-options";
import { RICH_TEXT_WRAPPER_SELECTOR } from "./constants";

let defaultsWereSet = false;

export const initializeFroalaEditor = (element: HTMLRichTextEditorElement, instanceSpecificOptions: Partial<Froala.FroalaOptions>, editorValue: string) => {
    if (!element) {
        return;
    }

    setFroalaDefaults(element);

    const customOptions = getCustomOptions(element);
    const events = getEvents(editorValue, instanceSpecificOptions, customOptions);
    const froalaOptions = getFroalaOptions(events, instanceSpecificOptions, customOptions);

    new FroalaEditor(element, froalaOptions);
}

export const destroyFroalaEditor = ({ editor }: InlineEditorOptions) => {
    const richTextEditor = editor.querySelector(RICH_TEXT_WRAPPER_SELECTOR);
    const froala = richTextEditor?.["data-froala.editor"];

    froala?.destroy();
}

const getCustomOptions = (richTextEditor: HTMLRichTextEditorElement): Partial<Froala.FroalaOptions> => {
    const configurationName = richTextEditor.dataset.richTextEditorConfiguration;
    const customConfiguration = window.kentico.pageBuilder.richTextEditor?.configurations?.[configurationName];
    removeFullScreenMode(customConfiguration?.toolbarButtons);

    return (typeof customConfiguration === "object") ? customConfiguration : {};
}

const removeFullScreenMode = (configuration: string[] | Partial<ToolbarButtons> | undefined): void => {
    if (configuration) {
        if (Array.isArray(configuration)) {
            configuration = configuration.filter(i => i !== 'fullscreen');
        }
        else if (typeof configuration === 'object') {
            for (const value of Object.values(configuration)) {
                if (value && value.buttons) {
                    value.buttons = value?.buttons.filter(i => i !== 'fullscreen');
                }
            }
        }
    }
}

const setFroalaDefaults = (richTextEditor: HTMLRichTextEditorElement) => {
    if (defaultsWereSet) {
        return;
    }

    const { getLinkMetadataEndpointUrl, richTextEditorLicense: licenseKey, contextMacros } = richTextEditor.dataset;
    Object.assign(Froala.DEFAULTS, { getLinkMetadataEndpointUrl, licenseKey }, !contextMacros ? {} : {
        contextMacros: JSON.parse(contextMacros),
    });

    defaultsWereSet = true;
}