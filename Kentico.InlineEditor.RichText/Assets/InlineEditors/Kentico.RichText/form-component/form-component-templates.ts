const froalaCss = require('froala-editor/css/froala_style.min.css')();

export const getPreviewIframeHtml = (html: string): string =>
    require("./preview-iframe.html")({
        html,
        froalaCss
    });

