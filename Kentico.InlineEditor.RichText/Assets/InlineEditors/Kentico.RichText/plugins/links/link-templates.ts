export const getLinkConfigurationPopupTemplate = (linkUrl: string, linkText: string, linkUrlLabel: string, linkTextLabel: string): string =>
    require("./templates/configure-link-popup.html")({
        linkUrl,
        linkText,
        linkUrlLabel,
        linkTextLabel,
        command: "Insert",
        actionButtonText: "Insert",
    });
