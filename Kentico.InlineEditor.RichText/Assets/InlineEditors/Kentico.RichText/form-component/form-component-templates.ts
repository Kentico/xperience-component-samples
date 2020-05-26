import { removeMacros } from "../plugins/macros/macro-services";

const froalaCss = require('froala-editor/css/froala_style.min.css')();

export const getPreviewIframeHtml = (html: string): string => {
    html = removeMacros(html);
    return require("./preview-iframe.html")({
        html,
        froalaCss
    });
}

