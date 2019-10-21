import CodeMirror from "codemirror";
import "codemirror/mode/xml/xml";
import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";

import "codemirror/lib/codemirror.css";
import "froala-editor/css/froala_editor.pkgd.css";

import { UPDATE_WIDGET_PROPERTY_EVENT_NAME } from "@/shared/constants";
import { imageReplaceCommand, insertImageCommand } from "./commands";
import { initializeMacroPlugin } from "./plugins/macros";
import { replaceMacroElements, replaceMacrosWithElements } from "./plugins/macros/macro-services";
import { MACRO_CLASS, OPEN_INSERT_MACRO_POPUP_COMMAND_NAME } from "./plugins/macros/macro-constants";

import { initializeLinkPlugin } from "./plugins/links";
import { OPEN_INSERT_LINK_POPUP_COMMAND_NAME, OPEN_EDIT_LINK_POPUP_COMMAND_NAME } from "./plugins/links/link-constants";

import "./style.less";

export const initializeFroalaEditor = (element: HTMLElement, inlineEditor: HTMLElement, propertyName: string, propertyValue: string) => {
    Froala.RegisterCommand("insertImageKentico", insertImageCommand);
    Froala.RegisterCommand("imageReplaceKentico", imageReplaceCommand);
    Froala.RegisterQuickInsertButton("imageKentico", insertImageCommand);

    initializeMacroPlugin(Froala, element);
    initializeLinkPlugin(Froala, element);

    new FroalaEditor(element, {
        key: element.dataset.richTextEditorLicense,
        toolbarInline: true,
        codeMirror: CodeMirror,
        pasteDeniedAttrs: [ "id", "style"],
        quickInsertButtons: ["imageKentico", "video", "table", "ul", "ol", "hr"],
        imageEditButtons: ["imageReplaceKentico", "imageAlign", "imageCaption", "imageRemove", "|", "imageLink", "linkOpen", "linkEdit",
            "linkRemove", "-", "imageDisplay", "imageStyle", "imageAlt", "imageSize"],
        linkEditButtons: ["linkOpen", OPEN_EDIT_LINK_POPUP_COMMAND_NAME, "linkRemove"],
        toolbarButtons:
        {
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
                buttons: [OPEN_INSERT_LINK_POPUP_COMMAND_NAME, "insertImageKentico", OPEN_INSERT_MACRO_POPUP_COMMAND_NAME, "insertVideo", "insertTable", "emoticons", "specialCharacters", "insertHR"]
            },
            moreMisc: {
                buttons: ["undo", "redo", "selectAll", "html", "help"],    
                align: "right",
                buttonsVisible: 2,
            }
        },
        events: {
            initialized(this: FroalaEditor) {
                if(propertyValue) {
                    const editModePropertyValue = replaceMacrosWithElements(propertyValue, this.opts.contextMacros);
                    this.html.set(editModePropertyValue);
                }
            },
            ["html.set"](this: FroalaEditor) {
                bindMacroClickListener(this);
            },
            contentChanged(this: FroalaEditor) {
                bindMacroClickListener(this);
                const event = new CustomEvent(UPDATE_WIDGET_PROPERTY_EVENT_NAME, {
                    detail: {
                        name: propertyName,
                        value: replaceMacroElements(this.html.get()),
                        refreshMarkup: false
                    }
                });

                inlineEditor.dispatchEvent(event);
            },
        },
    });
}

export const destroyFroalaEditor = (element: HTMLElement) => {
    const froala = (element as any)["data-froala.editor"];

    if (froala) {
        froala.destroy();
    }
}

const bindMacroClickListener = (editor: FroalaEditor) => {
    const macros = editor.el.querySelectorAll<HTMLInputElement>(`.${MACRO_CLASS}`);

    macros.forEach((macroEl) => {
        macroEl.onclick = () => editor.kenticoMacroPlugin.showActionsPopup(macroEl);
        // Prevents from showing the default froala button popup on right click 
        macroEl.onmousedown = (event) => event.stopPropagation();
    });
}
