import { Page } from "./page";

/**
 * Represents options of the opened page selector dialog.
 */
export interface PageSelectorOpenOptions {
    /**
     * A callback function invoked when the page selector's confirmation button is clicked.
     * @param selectedPages Selected pages.
     */
    readonly applyCallback: (selectedPages: Page[] | null) => void;

    /**
     * Determines the semantics of the identifier; eg. whether identifier corresponds to "guid" or "path".
     */
    readonly identifierMode?: IdentifierMode;

    /**
     * Array of selected values. Each selected value object contain a property "identifier" that that identifies the selected page.
     * Identifier can be either the page "NodeGuid" or the "NodeAliasPath".
     */
    readonly selectedValues?: [{ identifier: string }];
}

export enum IdentifierMode {
    Path = "path",
    Guid = "guid",
}
