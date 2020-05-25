export const getPreviewIframeHtml = (html: string): string =>
    require("./preview-iframe.html")({
        html,
    });

