import FroalaEditor, * as Froala from "froala-editor/js/froala_editor.pkgd.min";
import "froala-editor/css/froala_editor.pkgd.css";

import { UPDATE_WIDGET_PROPERTY_EVENT_NAME } from "@/shared/constants";
import { imageReplaceCommand, insertImageCommand } from "./commands";
import { initializeMacroPlugin } from "./plugins/macros";

import "./style.less";

export const initializeFroalaEditor = (element: HTMLElement, inlineEditor: HTMLElement, propertyName: string) => {
    Froala.RegisterCommand("insertImageKentico", insertImageCommand);
    Froala.RegisterCommand("imageReplaceKentico", imageReplaceCommand);
    Froala.RegisterQuickInsertButton("imageKentico", insertImageCommand);

    initializeMacroPlugin(Froala);

    new FroalaEditor(element, {
        toolbarInline: true,
        charCounterCount: false,
        quickInsertButtons: ["imageKentico", "video", "embedly", "table", "ul", "ol", "hr"],
        imageEditButtons: ["imageReplaceKentico", "imageAlign", "imageCaption", "imageRemove", "|", "imageLink", "linkOpen", "linkEdit",
            "linkRemove", "-", "imageDisplay", "imageStyle", "imageAlt", "imageSize"],
        toolbarButtons:
        {
            moreText: {
                buttons: ["bold", "italic", "underline", "strikeThrough", "subscript", "superscript", "fontFamily", "fontSize", "textColor",
                    "backgroundColor", "inlineClass", "inlineStyle", "clearFormatting"]
            },
            moreParagraph: {
                buttons: ["alignLeft", "alignCenter", "formatOLSimple", "alignRight", "alignJustify", "formatOL", "formatUL", "paragraphFormat",
                    "paragraphStyle", "lineHeight", "outdent", "indent", "quote"]
            },
            moreRich: {
                buttons: ["insertMacro", "insertLink", "insertImageKentico", "insertVideo", "insertTable", "emoticons", "fontAwesome", "specialCharacters",
                    "embedly", "insertFile", "insertHR"]
            },
            moreMisc: {
                buttons: ["undo", "redo", "fullscreen", "print", "getPDF", "spellChecker", "selectAll", "html", "help"],
                align: "right",
                buttonsVisible: 2,
            }
        },
        events: {
            contentChanged(this: FroalaEditor) {
                const froala = this;
                const macros = froala.el.querySelectorAll<HTMLElement>(".ktc-macro");

                macros.forEach((macroEl) => {
                    macroEl.onclick = () => froala.kenticoMacroPlugin.showPopup(macroEl);
                });

                const event = new CustomEvent(UPDATE_WIDGET_PROPERTY_EVENT_NAME, {
                    detail: {
                        name: propertyName,
                        value: this.html.get(),
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