import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import "./link-styles.less"
import { hideLinkConfigurationPopup, showLinkConfigurationPopup, showInsertLinkPopup } from "./popups/link-configuration-popup";
import { LinkPlugin } from "./link-types";

export const linkPlugin = (editor: FroalaEditor): LinkPlugin => {
    const linkPlugin: LinkPlugin = {
        showInsertLinkPopup,
        showLinkConfigurationPopup,
        hideLinkConfigurationPopup,
    };

    Object.keys(linkPlugin).forEach((key) => {
        linkPlugin[key] = linkPlugin[key].bind(editor);
    });

    return linkPlugin;
}
