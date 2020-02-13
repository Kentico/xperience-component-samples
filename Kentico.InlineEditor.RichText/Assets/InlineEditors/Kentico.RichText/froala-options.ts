import * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import CodeMirror from "codemirror";
import "codemirror/mode/xml/xml";
import "codemirror/lib/codemirror.css";

import { OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, OPEN_INSERT_LINK_POPUP_COMMAND_NAME } from "./plugins/links/link-constants";
import { OPEN_INSERT_MACRO_POPUP_COMMAND_NAME } from "./plugins/macros/macro-constants";

const defaultOptions: Partial<Froala.FroalaOptions> = {
    toolbarInline: true,
    codeMirror: CodeMirror,
    pasteDeniedAttrs: ["id", "style"],
    imageAllowedTypes: ["gif", "png", "jpg", "jpeg"],
    quickInsertButtons: ["image", "video", "table", "ul", "ol", "hr"],
    linkEditButtons: ["linkOpen", OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, "linkRemove"],
    toolbarButtons: {
        moreText: {
            buttons: ["bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "fontFamily", "fontSize", "textColor",
                "backgroundColor", "inlineClass", "inlineStyle", "clearFormatting"]
        },
        moreParagraph: {
            buttons: ["formatOL", "formatUL", "paragraphFormat", "alignLeft", "alignCenter", "formatOLSimple", "alignRight", "alignJustify",
                "paragraphStyle", "lineHeight", "outdent", "indent", "quote"],
            buttonsVisible: 2,
        },
        moreRich: {
            buttons: [OPEN_INSERT_LINK_POPUP_COMMAND_NAME, "insertImage", OPEN_INSERT_MACRO_POPUP_COMMAND_NAME, "insertVideo", "insertTable", "emoticons", "specialCharacters", "insertHR"]
        },
        moreMisc: {
            buttons: ["undo", "redo", "fullscreen", "selectAll", "html", "help"],
            align: "right",
            buttonsVisible: 2,
        }
    },
};

export const getFroalaOptions = (events: Partial<Froala.FroalaEvents>, customOptions: Partial<Froala.FroalaOptions>): Partial<Froala.FroalaOptions> => ({
    ...defaultOptions,
    ...customOptions,
    key: Froala.DEFAULTS.licenseKey,
    events,
    attribution: false,
})
