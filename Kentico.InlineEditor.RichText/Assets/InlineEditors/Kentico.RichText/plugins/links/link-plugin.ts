import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { showLinkPopup, hideLinkConfigurationPopup } from "./popups/link-edit-popup";
import "./link-styles.less"

export const linkPlugin = (editor: FroalaEditor): any => {
    const linkPlugin: any = {
        showLinkPopup,
        hideLinkConfigurationPopup
    };

    Object.keys(linkPlugin).forEach((key) => {
        linkPlugin[key] = linkPlugin[key].bind(editor);
    });

    return linkPlugin;
}
