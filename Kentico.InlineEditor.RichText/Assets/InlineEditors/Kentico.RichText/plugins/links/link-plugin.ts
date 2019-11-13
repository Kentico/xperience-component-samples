import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import "./link-styles.less"
import { hideLinkConfigurationPopup, getShowLinkPopup } from "./popups/link-edit-popup";
import { LinkPlugin, LinkType } from "./link-types";
import { INSERT_LINK_POPUP_NAME, CONFIGURE_PAGE_LINK_POPUP_NAME, CONFIGURE_EXTERNAL_LINK_POPUP_NAME } from "./link-constants";

export const linkPlugin = (editor: FroalaEditor): LinkPlugin => {
    const linkPlugin: LinkPlugin = {
        showLinkPopup: getShowLinkPopup(INSERT_LINK_POPUP_NAME, editor.opts.popupInsertLinkButtons, LinkType.PAGE),
        showConfigurePageLinkPopup: getShowLinkPopup(CONFIGURE_PAGE_LINK_POPUP_NAME, editor.opts.popupUpdatePageLinkButtons, LinkType.PAGE),
        showConfigureExternalLinkPopup: getShowLinkPopup(CONFIGURE_EXTERNAL_LINK_POPUP_NAME, editor.opts.popupUpdateExternalLinkButtons, LinkType.EXTERNAL),
        hideLinkConfigurationPopup,
    };

    Object.keys(linkPlugin).forEach((key) => {
        linkPlugin[key] = linkPlugin[key].bind(editor);
    });

    return linkPlugin;
}
