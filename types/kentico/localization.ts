export interface Localization {
    /**
     * Current culture code.
     */
    readonly cultureCode: string;

    /**
     * Collection of resource strings.
     */
    readonly strings: { [resourceString: string]: string };
}