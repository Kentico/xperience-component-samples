import { MediaFilesSelector } from "./selectors/media-files-selector";

export interface ModalDialog {
    /**
     * Media files selector.
     */
    readonly mediaFilesSelector: MediaFilesSelector;
}