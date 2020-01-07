import { DialogMode } from "../plugin-types";
import { INSERT_PAGE_LINK_COMMAND_NAME, INSERT_GENERAL_LINK_COMMAND_NAME } from "./link-constants";
import { getString } from "./link-helpers";
import { LinkDescriptor } from "./link-descriptor";

export const getPageLinkConfigurationPopupTemplate = (pageName: string | null, linkDescriptor: LinkDescriptor, dialogMode: DialogMode): string =>
    require("./templates/configure-page-link-popup.html")({
        pageName,
        pageUrl: linkDescriptor.linkURL,
        linkText: linkDescriptor.linkText,
        linkTextLabel: getString("Label.Text"),
        openInNewTabLabel: getString("Label.OpenInNewTab"),
        openInNewTab: linkDescriptor.openInNewTab,
        command: INSERT_PAGE_LINK_COMMAND_NAME,
        actionButtonText: getString(dialogMode === DialogMode.INSERT ? "ActionButton.Insert" : "ActionButton.Save"),
        pageSelectionButtonText: getString(linkDescriptor.linkURL ? "ActionButton.ChangePage" : "ActionButton.SelectPage"),
    });

export const getGeneralLinkConfigurationPopupTemplate = (linkDescriptor: LinkDescriptor, dialogMode: DialogMode): string =>
    require("./templates/configure-general-link-popup.html")({
        linkUrl: linkDescriptor.linkURL,
        linkText: linkDescriptor.linkText,
        linkUrlLabel: getString("Label.Url"),
        linkTextLabel: getString("Label.Text"),
        openInNewTabLabel: getString("Label.OpenInNewTab"),
        openInNewTab: linkDescriptor.openInNewTab,
        command: INSERT_GENERAL_LINK_COMMAND_NAME,
        actionButtonText: getString(dialogMode === DialogMode.INSERT ? "ActionButton.Insert" : "ActionButton.Save"),
    });

export const getMediaLinkConfigurationPopupTemplate = (mediaName: string | null, linkDescriptor: LinkDescriptor, dialogMode: DialogMode): string =>
    require("./templates/configure-media-link-popup.html")({
        mediaName,
        mediaSelectionButtonText: getString(linkDescriptor.linkURL ? "ActionButton.ChangeMedia" : "ActionButton.SelectMedia"),
        mediaLinkText: linkDescriptor.linkText,
        mediaLinkTextLabel: getString("Label.Text"),
        mediaLinkUrl: linkDescriptor.linkURL,
        openInNewTab: linkDescriptor.openInNewTab,
        openInNewTabLabel: getString("Label.OpenInNewTab"),
        command: "", // TODO: MAE-54 Add command name
        actionButtonText: getString(dialogMode === DialogMode.INSERT ? "ActionButton.Insert" : "ActionButton.Save")
    });
