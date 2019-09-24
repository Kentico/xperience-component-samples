import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import { hideToolbar, showToolbar } from "../toolbar-helpers";
import { getMediaFilesSelector } from "./helpers";
import { ALLOWED_IMAGE_EXTENSIONS } from "../constants";

export const insertImageCommand: RegisterCommandParameters = {
    title: "Insert Image",
    icon: "insertImage",
    focus: true,
    undo: true,
    refreshAfterCallback: false,
    callback(this: FroalaEditor) {
        const froala = this;
        hideToolbar();

        getMediaFilesSelector().open({
            allowedExtensions: ALLOWED_IMAGE_EXTENSIONS,
            applyCallback(images) {
                if (images) {
                    const selectedImage = images[0];
                    froala.image.insert(selectedImage.url, true, { name: selectedImage.name, id: selectedImage.fileGuid });
                }
                showToolbar();
            },
            cancelCallback() {
                showToolbar();
            }
        });
    }
}