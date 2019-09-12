export interface MediaFile {
    /**
     * Name of the file.
     */
    readonly name: string;

    /**
     * File type extension.
     */
    readonly extension: string;

    /**
     * GUID of the selected file.
     */
    readonly fileGuid: string;

    /**
     * Relative URL from which you can access the selected file.
     */
    readonly url: string;

    /**
     * URLs of the image file's thumbnails. Not all file types support thumbnails (e.g. .pdf files).
     * The property consists of three string URLs, each for a different typified size of the thumbnail: small, medium, and large.
     */
    readonly thumbnailUrls: string[];

    /**
     * MIME type of the file.
     */
    readonly mimeType: string;

    /**
     * Size of the file in bytes.
     */
    readonly size: number;

    /**
     * Title of the selected file.
     */
    readonly title: string;

    /**
     * Description of the file.
     */
    readonly description: string;

    /**
     * Relative path to the folder within the media library containing the selected file.
     */
    readonly folderPath: string;

    /**
     * Name of the library from which the file was selected.
     */
    readonly libraryName: string;

    /**
     * Name of the site to which the file (i.e. the media library) belongs.
     */
    readonly siteName: string;

    /**
     * Indicates whether the selected file is valid (e.g. if the file was not deleted from the media library after being selected).
     * If false, the object's other properties might not be correctly set.
     */
    readonly isValid: boolean;
}