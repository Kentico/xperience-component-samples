import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";
import "./style.less";

import { InlineEditorOptions } from "@/types/kentico/inline-editors/inline-editor-options";
import { HTMLRichTextEditorElement } from "@/types/rich-text";
import { getEvents } from "./froala-events";
import { getFroalaOptions } from "./froala-options";
import { RICH_TEXT_WRAPPER_SELECTOR } from "./constants";
import { FroalaOptionsModifier } from "./types";

let defaultsWereSet = false;

export const initializeFroalaEditor = (element: HTMLRichTextEditorElement, instanceSpecificOptions: Partial<Froala.FroalaOptions>, editorValue: string, froalaOptionsModifier?: FroalaOptionsModifier) => {
    if (!element) {
        return;
    }

    setFroalaDefaults(element);

    const customOptions = getCustomOptions(element);
    const events = getEvents(editorValue, instanceSpecificOptions, customOptions);
    const froalaOptions = getFroalaOptions(events, instanceSpecificOptions, customOptions);

    if (froalaOptionsModifier)
    {
        froalaOptionsModifier(froalaOptions);
    }

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

    return (typeof customConfiguration === "object") ? customConfiguration : {};
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
