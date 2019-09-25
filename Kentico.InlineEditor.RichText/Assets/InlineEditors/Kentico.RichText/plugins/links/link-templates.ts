import { DialogMode } from "../plugin-types";
import { INSERT_PAGE_LINK_COMMAND_NAME, UPDATE_LINK_COMMAND_NAME } from "./link-constants";
import { getString } from "./link-helpers";

export const getLinkConfigurationPopupTemplate = (linkUrl: string, linkText: string, dialogMode: DialogMode): string =>
    require("./templates/configure-link-popup.html")({
        linkUrl,
        linkText,
        linkUrlLabel: getString("Label.Path"),
        linkTextLabel: getString("Label.Text"),
        command: dialogMode === DialogMode.INSERT ? INSERT_PAGE_LINK_COMMAND_NAME : UPDATE_LINK_COMMAND_NAME,
        actionButtonText: getString(dialogMode === DialogMode.INSERT ? "ActionButton.Insert" : "ActionButton.Save"),
    });
