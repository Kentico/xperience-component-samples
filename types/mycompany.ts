export interface ImageUrlOptions {
    readonly identifier: string;
    readonly controlClassName: string;
    readonly validationClassName: string;
    readonly imagePreviewClassName: string;
    readonly placeholderImageUri: string;
}

export interface ImageUrlWithPreview {
    readonly init: (options: ImageUrlOptions) => void;
}

interface FormComponents {
    readonly imageUrlWithPreview: ImageUrlWithPreview;
}

export interface MyCompany {
    readonly formComponents: FormComponents;
}