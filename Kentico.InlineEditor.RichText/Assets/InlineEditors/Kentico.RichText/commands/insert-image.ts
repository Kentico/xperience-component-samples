import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import { hideToolbar, showToolbar } from "../toolbar-helpers";
import { getMediaFilesSelector } from "./helpers";

export const insertImageCommand: RegisterCommandParameters = {
    title: "Insert Image",
    icon: "insertImage",
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
}