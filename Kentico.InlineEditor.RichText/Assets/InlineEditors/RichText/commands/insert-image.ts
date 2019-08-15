import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";
import { hideToolbar, showToolbar } from "../toolbar-helpers";
import { getMediaFilesSelector } from "./helpers";

export const insertImageCommand: RegisterCommandParameters = {
    title: "Insert Image (Ctrl+P)",
    icon: "insertImage",
    focus: true,
    undo: true,
    refreshAfterCallback: false,
    callback(this: FroalaEditor) {
        const froala = this;
        hideToolbar();

        getMediaFilesSelector().open({
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