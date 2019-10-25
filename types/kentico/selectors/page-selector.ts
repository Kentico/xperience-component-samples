import { PageSelectorOpenOptions } from "./page-selector-open-options";

export interface PageSelector {
    /**
     * Opens page selection dialog.
     */
    readonly open: (options: PageSelectorOpenOptions) => void;
}