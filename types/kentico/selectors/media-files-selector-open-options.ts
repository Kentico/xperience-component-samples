import { MediaFile } from "./media-file";

export interface MediaFilesSelectorOpenOptions {
    /**
     * A callback function invoked when the media file selector's confirmation button is clicked.
     * @param mediaFiles Selected media files or null when no file selected.
     */
    readonly applyCallback: (mediaFiles: MediaFile[] | null) => void;
  
    /**
     * A callback function invoked when the dialog is closed.
     */
    readonly cancelCallback?: () => void;
  
    /**
     * Code name of a (single) media library from which you can select files in the selector.
     * If not specified, the selector allows selecting from all media libraries of the current site for which the user has permissions.
     */
    readonly libraryName?: string;
  
    /**
     * Limit on the maximum number of files allowed to be selected.
     * 1 stands for a single file selection and 0 stands for unlimited file selection.
     * If not specified, the selector is configured for a single file selection by default.
     */
    readonly maxFilesLimit?: number;
  
    /**
     * An array of objects with the fileGuid property that represent initially selected media files (their GUIDs).
     */
    readonly selectedValues?: Array<{ fileGuid: string}>;
  
    /**
     * A semicolon-delimited string of file extensions that specify the allowed file extensions for the files to be selected.
     */
    readonly allowedExtensions?: string;
  }