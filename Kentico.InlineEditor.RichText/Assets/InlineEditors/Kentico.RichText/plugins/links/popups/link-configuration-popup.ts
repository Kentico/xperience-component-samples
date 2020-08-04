import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { showPopup, getDialogElement, bindFocusEventToInputs } from "../../popup-helper";
import { INSERT_LINK_POPUP_NAME, CONFIGURE_PAGE_LINK_POPUP_NAME, SWITCH_PAGE_LINK_TAB_COMMAND_NAME, SWITCH_GENERAL_LINK_TAB_COMMAND_NAME, CONFIGURE_GENERAL_LINK_POPUP_NAME, SWITCH_MEDIA_LINK_TAB_COMMAND_NAME, CONFIGURE_MEDIA_LINK_POPUP_NAME, CONFIGURATION_POPUP_WIDTH_PX } from "../link-constants";
import { getPageLinkConfigurationPopupTemplate, getGeneralLinkConfigurationPopupTemplate, getMediaLinkConfigurationPopupTemplate } from "../link-templates";
import { DialogMode } from "../../plugin-types";
import { LinkType } from "../link-types";
import { LinkModel } from "../link-model";
import { LinkDescriptor } from "../link-descriptor";
import { ACTIVE_POPUP_TAB_CLASS_NAME } from "../../../constants";

const POPUP_TEMPLATE_BODY_CLASS_NAME = "ktc-configure-popup";

const getShowLinkPopup = (popupName: string, buttons: any[], linkModel: LinkModel) =>
    (editor: FroalaEditor, linkDescriptor: LinkDescriptor, getRelatedElement?: () => Element, dialogMode: DialogMode = DialogMode.INSERT) => {
        const customLayer = `<div class="${POPUP_TEMPLATE_BODY_CLASS_NAME}"></div>`;
        showPopup(editor, popupName, buttons, dialogMode, CONFIGURATION_POPUP_WIDTH_PX, getRelatedElement, customLayer);
        showForm(editor, popupName, linkDescriptor, linkModel, dialogMode);
    }

export function showInsertLinkPopup(this: FroalaEditor, linkDescriptor: LinkDescriptor, getRelatedElement?: () => Element) {
    getShowLinkPopup(INSERT_LINK_POPUP_NAME, this.opts.popupInsertLinkButtons, new LinkModel(LinkType.PAGE))(this, linkDescriptor, getRelatedElement);
}

export function showLinkConfigurationPopup(this: FroalaEditor, linkDescriptor: LinkDescriptor, linkModel: LinkModel) {
    const { buttons, popupName } = getPopupInfo(this, linkModel.linkType);
    const showLinkPopup = getShowLinkPopup(popupName, buttons, linkModel);
    showLinkPopup(this, linkDescriptor, () => this.link.get(), DialogMode.UPDATE);
}

export const showForm = (editor: FroalaEditor, popupName: string, linkDescriptor: LinkDescriptor, linkModel: LinkModel, dialogMode = DialogMode.INSERT) => {
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

    const previousSelectedTab = dialog.querySelector<HTMLButtonElement>(`.fr-command.${ACTIVE_POPUP_TAB_CLASS_NAME}`);
    previousSelectedTab?.classList.remove(ACTIVE_POPUP_TAB_CLASS_NAME);
    const selectedTab = dialog.querySelector<HTMLButtonElement>(`.fr-command[data-cmd="${tabCommand}"]`);
    selectedTab?.classList.add(ACTIVE_POPUP_TAB_CLASS_NAME);

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

const getPopupInfo = (editor: FroalaEditor, linkType: LinkType) => {
    switch (linkType) {
        case LinkType.PAGE:
            return {
                popupName: CONFIGURE_PAGE_LINK_POPUP_NAME,
                buttons: editor.opts.popupUpdatePageLinkButtons,
            };
        case LinkType.MEDIA:
            return {
                popupName: CONFIGURE_MEDIA_LINK_POPUP_NAME,
                buttons: editor.opts.popupUpdateMediaLinkButtons,
            };
        default:
            return {
                popupName: CONFIGURE_GENERAL_LINK_POPUP_NAME,
                buttons: editor.opts.popupUpdateGeneralLinkButtons,
            };
    }
};
