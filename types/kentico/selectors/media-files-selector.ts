import { MediaFilesSelectorOpenOptions } from "./media-files-selector-open-options";

export interface MediaFilesSelector {
    /**
     * Opens media files selection dialog.
     */
    readonly open: (options: MediaFilesSelectorOpenOptions) => void;
}