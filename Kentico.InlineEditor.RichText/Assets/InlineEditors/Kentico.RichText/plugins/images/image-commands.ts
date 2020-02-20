import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";

import { hideToolbar, showToolbar } from "../../toolbar-helpers";
import { FroalaCommand } from "../../froala-command";
import { INSERT_IMAGE_COMMAND_NAME, REPLACE_IMAGE_COMMAND_NAME, INSERT_IMAGE_QUICK_COMMAND_NAME } from "./image-constants";
import { FroalaQuickCommand } from "../../froala-quick-command";

const insertImageCommandParameters: RegisterCommandParameters = {
    title: "Insert Image",
    icon: INSERT_IMAGE_COMMAND_NAME,
    focus: true,
    undo: true,
    refreshAfterCallback: false,
    callback(this: FroalaEditor) {
        const { image, opts } = this;
        hideToolbar();

        getMediaFilesSelector().open({
            allowedExtensions: `.${opts.imageAllowedTypes.join(";.")}`,
            applyCallback(images) {
                if (images) {
                    const selectedImage = images[0];
                    image.insert(selectedImage.url, true, { name: selectedImage.name, id: selectedImage.fileGuid });
                }
                showToolbar();
            },
            cancelCallback() {
                showToolbar();
            }
        });
    }
};
const insertImageCommand = new FroalaCommand(INSERT_IMAGE_COMMAND_NAME, insertImageCommandParameters);
const insertImageQuickCommand = new FroalaQuickCommand(INSERT_IMAGE_QUICK_COMMAND_NAME, insertImageCommandParameters);

const imageReplaceCommand = new FroalaCommand(REPLACE_IMAGE_COMMAND_NAME, {
    title: "Replace",
    focus: false,
    undo: true,
    refreshAfterCallback: false,
    callback(this: FroalaEditor) {
        const { image, opts } = this;
        const currentImage = image.get();
        const currentImageElement = (currentImage as HTMLImageElement[])[0];
        // When image is inserted for the first time froala inserts the image data into "str" prefixed data attributes,
        // although when the image is replaced the new values are not prefixed.
        const currentImageId = currentImageElement.dataset.id || currentImageElement.dataset.strid;

        getMediaFilesSelector().open({
            allowedExtensions: `.${opts.imageAllowedTypes.join(";.")}`,
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
});

const getMediaFilesSelector = () => window.kentico.modalDialog.mediaFilesSelector;

export const imageCommands = [
    insertImageCommand,
    imageReplaceCommand,
    insertImageQuickCommand,
];