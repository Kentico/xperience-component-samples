import { DialogMode } from "../plugin-types";
import { INSERT_PAGE_LINK_COMMAND_NAME, UPDATE_PAGE_LINK_COMMAND_NAME, UPDATE_EXTERNAL_LINK_COMMAND_NAME, INSERT_EXTERNAL_LINK_COMMAND_NAME } from "./link-constants";
import { getString } from "./link-helpers";

export const getLinkConfigurationPopupTemplate = (pageName: string, linkUrl: string, linkText: string, openInNewTab: boolean, dialogMode: DialogMode): string =>
    require("./templates/configure-link-popup.html")({
        pageName,
        pageUrl: linkUrl,
        linkText,
        linkTextLabel: getString("Label.Text"),
        openInNewTabLabel: getString("Label.OpenInNewTab"),
        openInNewTab,
        command: dialogMode === DialogMode.INSERT ? INSERT_PAGE_LINK_COMMAND_NAME : UPDATE_PAGE_LINK_COMMAND_NAME,
        actionButtonText: getString(dialogMode === DialogMode.INSERT ? "ActionButton.Insert" : "ActionButton.Save"),
        pageSelectionButtonText: getString(linkUrl ? "ActionButton.ChangePage" : "ActionButton.SelectPage"),
    });

export const getExternalLinkConfigurationPopupTemplate = (linkUrl: string, linkText: string, openInNewTab: boolean, dialogMode: DialogMode): string =>
    require("./templates/configure-external-link-popup.html")({
        linkUrl,
        linkText,
        linkUrlLabel: getString("Label.Url"),
        linkTextLabel: getString("Label.Text"),
        openInNewTabLabel: getString("Label.OpenInNewTab"),
        openInNewTab,
        command: dialogMode === DialogMode.INSERT ? INSERT_EXTERNAL_LINK_COMMAND_NAME : UPDATE_EXTERNAL_LINK_COMMAND_NAME,
        actionButtonText: getString(dialogMode === DialogMode.INSERT ? "ActionButton.Insert" : "ActionButton.Save"),
    });
