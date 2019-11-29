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
import { unwrapElement } from "./plugins/popup-helper";

import { initializeLinkPlugin } from "./plugins/links";
import { OPEN_INSERT_LINK_POPUP_COMMAND_NAME, OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME } from "./plugins/links/link-constants";

import "./style.less";

interface CodeMirrorElement extends HTMLElement {
    readonly CodeMirror: CodeMirror.Editor;
}

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
        pasteDeniedAttrs: ["id", "style"],
        quickInsertButtons: ["imageKentico", "video", "table", "ul", "ol", "hr"],
        imageEditButtons: ["imageReplaceKentico", "imageAlign", "imageCaption", "imageRemove", "|", "imageLink", "linkOpen", "linkEdit",
            "linkRemove", "-", "imageDisplay", "imageStyle", "imageAlt", "imageSize"],
        linkEditButtons: ["linkOpen", OPEN_LINK_CONFIGURATION_POPUP_COMMAND_NAME, "linkRemove"],
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
                if (propertyValue) {
                    const editModePropertyValue = replaceMacrosWithElements(propertyValue, this.opts.contextMacros);
                    this.html.set(editModePropertyValue);
                }
            },
            ["html.set"](this: FroalaEditor) {
                bindMacroClickListener(this);
            },
            contentChanged(this: FroalaEditor) {
                bindMacroClickListener(this);
                updatePropertyValue(inlineEditor, propertyName, this.html.get());
            },
            ["commands.after"](cmd: string) {
                if (cmd === "html" && this.codeView.isActive()) {
                    // Update the underlying Froala HTML when code is changed in CodeMirror
                    const froalaWrapper = unwrapElement(this.$wp);
                    const codeMirrorInstance = froalaWrapper!.querySelector<CodeMirrorElement>(".CodeMirror");
                    if (codeMirrorInstance) {
                        codeMirrorInstance.CodeMirror.on("change", function (instance: CodeMirror.Editor) {
                            updatePropertyValue(inlineEditor, propertyName, instance.getValue());
                        });
                    }

                    // Temporary, until https://github.com/froala/wysiwyg-editor/issues/3639 is fixed
                    const editor = unwrapElement(this.$oel);
                    const codeViewExitButton = editor!.querySelector(".fr-btn.html-switch");
                    codeViewExitButton!.innerHTML = this.button.build("html");
                }
            }
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

const updatePropertyValue = (inlineEditor: HTMLElement, propertyName: string, newValue: string) => {
    const event = new CustomEvent(UPDATE_WIDGET_PROPERTY_EVENT_NAME, {
        detail: {
            name: propertyName,
            value: replaceMacroElements(newValue),
            refreshMarkup: false
        }
    });

    inlineEditor.dispatchEvent(event);
}
