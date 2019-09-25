import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { showInsertLinkPopup } from "./popups/link-edit-popup";

export const linkPlugin = (editor: FroalaEditor): any => {
    const linkPlugin: any = {
        showInsertLinkPopup
    };

    Object.keys(linkPlugin).forEach((key) => {
        linkPlugin[key] = linkPlugin[key].bind(editor);
    });

    return linkPlugin;
}
