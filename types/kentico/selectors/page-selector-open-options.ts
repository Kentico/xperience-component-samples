import { Page } from "./page";

export interface PageSelectorOpenOptions {
    /**
     * A callback function invoked when the page selector's confirmation button is clicked.
     * @param selectedPages Selected pages.
     */
    readonly applyCallback: (selectedPages: Page[] | null) => void;
    readonly identifierMode: string;
    readonly selectedValues: [{ identifier: string }];
}
