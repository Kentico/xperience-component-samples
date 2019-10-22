import { MediaFilesSelector } from "./selectors/media-files-selector";
import { PageSelector } from "./selectors/page-selector";

export interface ModalDialog {
    /**
     * Media files selector.
     */
    readonly mediaFilesSelector: MediaFilesSelector;

    /**
     * Page selector.
     */
    readonly pageSelector: PageSelector;
}