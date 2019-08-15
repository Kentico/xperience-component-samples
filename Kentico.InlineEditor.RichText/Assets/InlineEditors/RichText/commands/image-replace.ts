import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import { getMediaFilesSelector } from "./helpers";

export const imageReplaceCommand: RegisterCommandParameters = {
    title: "Replace",
    icon: "imageReplace",
    focus: false,
    undo: true,
    refreshAfterCallback: false,
    callback(this: FroalaEditor) {
        const { image } = this;
        const currentImage = image.get();
        const currentImageElement = (currentImage as HTMLImageElement[])[0];
        // When image is inserted for the first time froala inserts the image data into "str" prefixed data attributes,
        // although when the image is replaced the new values are not prefixed.
        const currentImageId = currentImageElement.dataset.id || currentImageElement.dataset.strid;

        getMediaFilesSelector().open({
            maxFilesLimit: 1,
            selectedValues: [{ fileGuid: currentImageId! }],
            applyCallback(images: any) {
                if (images) {
                    const selectedImage = images[0];

                    // Replace image when the ID is different
                    if (selectedImage.fileGuid !== currentImageId) {
                        image.insert(selectedImage.url, true, { name: selectedImage.name, id: selectedImage.fileGuid }, currentImage);
                    }
                }
            },
        });
    }
}