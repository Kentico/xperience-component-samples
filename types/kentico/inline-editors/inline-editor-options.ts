import { LocalizationService } from "./localization-service";

export interface InlineEditorOptions {
    /**
     * Inline editor instance wrapper element.
     */
    readonly editor: HTMLElement;

    /**
     * Localization service.
     */
    readonly localizationService: LocalizationService;

    /**
     * Widget property value.
     */
    readonly propertyValue: string;

    /**
     * Widget property name on which the inline editor operates.
     */
    readonly propertyName: string;
}