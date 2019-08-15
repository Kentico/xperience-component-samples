export interface LocalizationService {
    /**
     * Current culture code.
     */
    readonly cultureCode: string;

    /**
     * Gets localized text of resource string for current culture.
     * @param resourceString Resource string.
     * @param parameters Parameters for the string formatting after localizing.
     * @returns Localized text.
     */
    readonly getString: (resourceString: string, ...parameters: any[]) => string;
}