import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { showPopup, getDialogElement, bindFocusEventToInputs } from "../../popup-helper";
import { INSERT_LINK_POPUP_NAME, CONFIGURE_PAGE_LINK_POPUP_NAME, SWITCH_PAGE_LINK_TAB_COMMAND_NAME, SWITCH_GENERAL_LINK_TAB_COMMAND_NAME, CONFIGURE_GENERAL_LINK_POPUP_NAME, SWITCH_MEDIA_LINK_TAB_COMMAND_NAME, CONFIGURE_MEDIA_LINK_POPUP_NAME } from "../link-constants";
import { getPageLinkConfigurationPopupTemplate, getGeneralLinkConfigurationPopupTemplate, getMediaLinkConfigurationPopupTemplate } from "../link-templates";
import { DialogMode } from "../../plugin-types";
import { getString, getLinkModel } from "../link-helpers";
import { LinkType } from "../link-types";
import { LinkModel } from "../link-model";
import { LinkDescriptor } from "../link-descriptor";

import { IdentifierMode, PageSelectorOpenOptions } from "@/types/kentico/selectors/page-selector-open-options";
import { MediaFilesSelectorOpenOptions } from "@/types/kentico/selectors/media-files-selector-open-options";

const POPUP_TEMPLATE_BODY_CLASS_NAME = "ktc-configure-popup";

const getShowLinkPopup = (popupName: string, buttons: any[], linkModel: LinkModel) =>
    (editor: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor, dialogMode: DialogMode = DialogMode.INSERT) => {
        const customLayer = `<div class="${POPUP_TEMPLATE_BODY_CLASS_NAME}"></div>`;
        showPopup(editor, popupName, relatedElementPosition, buttons, customLayer);
        showForm(editor, popupName, linkDescriptor, linkModel, dialogMode);
    }

export async function showInsertLinkPopup(this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor) {
    getShowLinkPopup(INSERT_LINK_POPUP_NAME, this.opts.popupInsertLinkButtons, new LinkModel(LinkType.PAGE))(this, relatedElementPosition, linkDescriptor);
}

export async function showLinkConfigurationPopup(this: FroalaEditor, relatedElementPosition: DOMRect | ClientRect, linkDescriptor: LinkDescriptor, linkModel: LinkModel) {
    const showLinkPopup = linkModel.linkType === LinkType.PAGE
        ? getShowLinkPopup(CONFIGURE_PAGE_LINK_POPUP_NAME, this.opts.popupUpdatePageLinkButtons, linkModel)
        : linkModel.linkType === LinkType.MEDIA
            ? getShowLinkPopup(CONFIGURE_MEDIA_LINK_POPUP_NAME, this.opts.popupUpdateMediaLinkButtons, linkModel)
            : getShowLinkPopup(CONFIGURE_GENERAL_LINK_POPUP_NAME, this.opts.popupUpdateGeneralLinkButtons, linkModel);

    showLinkPopup(this, relatedElementPosition, linkDescriptor, DialogMode.UPDATE);
}

export const showForm = (editor: FroalaEditor, popupName: string, linkDescriptor: LinkDescriptor, linkModel: LinkModel, dialogMode: DialogMode = DialogMode.INSERT) => {
    const dialog = getDialogElement(editor, popupName);

    if (!dialog) {
        return;
    }

    const { linkType } = linkModel;
    const container = dialog.querySelector<HTMLElement>(`.${POPUP_TEMPLATE_BODY_CLASS_NAME}`);
    const tabCommand =
        linkType === LinkType.PAGE
            ? SWITCH_PAGE_LINK_TAB_COMMAND_NAME
            : linkType === LinkType.MEDIA
                ? SWITCH_MEDIA_LINK_TAB_COMMAND_NAME
                : SWITCH_GENERAL_LINK_TAB_COMMAND_NAME;

    if (!container) {
        return;
    }

    switch (linkType) {
        case LinkType.PAGE:
            const pageName = linkModel.linkMetadata && linkModel.linkMetadata.name;
            container.innerHTML = getPageLinkConfigurationPopupTemplate(pageName, linkDescriptor, dialogMode);
            break;

        case LinkType.LOCAL:
            const { linkText, openInNewTab } = linkDescriptor;
            const descriptor = new LinkDescriptor(linkText, linkModel.linkURL!, openInNewTab);
            container.innerHTML = getGeneralLinkConfigurationPopupTemplate(descriptor, dialogMode);
            break;

        case LinkType.EXTERNAL:
            container.innerHTML = getGeneralLinkConfigurationPopupTemplate(linkDescriptor, dialogMode);
            break;

        case LinkType.MEDIA:
            const mediaName = linkModel.linkMetadata && linkModel.linkMetadata.name;
            container.innerHTML = getMediaLinkConfigurationPopupTemplate(mediaName, linkDescriptor, dialogMode);
            break;

        default:
            break;
    }

    const button = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
    button!.classList.add("fr-active", "fr-selected");

    bindFocusEventToInputs(dialog);

    const popup = editor.popups.get(popupName);
    editor.accessibility.focusPopup(popup);
}

export function hideLinkConfigurationPopup(this: FroalaEditor) {
    this.popups.hide(INSERT_LINK_POPUP_NAME);
    this.popups.hide(CONFIGURE_PAGE_LINK_POPUP_NAME);
    this.popups.hide(CONFIGURE_GENERAL_LINK_POPUP_NAME);
    this.popups.hide(CONFIGURE_MEDIA_LINK_POPUP_NAME);
}
