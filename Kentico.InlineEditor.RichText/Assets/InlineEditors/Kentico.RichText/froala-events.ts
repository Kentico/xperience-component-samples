import FroalaEditor, { FroalaOptions, FroalaEvents } from "froala-editor/js/froala_editor.pkgd.min";

import { UPDATE_WIDGET_PROPERTY_EVENT_NAME } from "@/shared/constants";
import { replaceMacrosWithElements, replaceMacroElements, bindMacroClickListener } from "./plugins/macros/macro-services";
import { unwrapElement } from "./helpers";
import { InlineEditorOptions } from "@/types/kentico/inline-editors/inline-editor-options";
import { RichTextFormComponentOptions, EditorType, CodeMirrorElement, FroalaEventsOption } from "./types";
import { FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME } from "./constants";

export const getEvents = (options: InlineEditorOptions | RichTextFormComponentOptions, customOptions: Partial<FroalaOptions>, editorType: EditorType): Partial<FroalaEvents> => {
    const editor = options.editor;
    const propertyName = (options as InlineEditorOptions).propertyName
    const propertyValue = editorType === "InlineEditor" 
        ? (options as InlineEditorOptions).propertyValue
        : editor.querySelector<HTMLInputElement>(`.${FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME}`)!.value;

    const events: Partial<FroalaEvents> = {
        initialized() {
            if (propertyValue) {
                const editModePropertyValue = replaceMacrosWithElements(propertyValue, this.opts.contextMacros);
                this.html.set(editModePropertyValue);
            }
            if (editorType === "FormComponent") {
                ensureFormComponentInitialization(this, editor);
            }
        },
        ["html.set"]() {
            bindMacroClickListener(this);
        },
        contentChanged() {
            bindMacroClickListener(this);
            if (editorType === "InlineEditor") {
                updatePropertyValue(editor, propertyName, this.html.get());
            }
        },
        ["commands.after"](cmd: string) {
            if (cmd === "html" && this.codeView.isActive() && editorType === "InlineEditor") {
                // Update the underlying Froala HTML when code is changed in CodeMirror
                const froalaWrapper = unwrapElement(this.$wp);
                const codeMirrorInstance = froalaWrapper!.querySelector<CodeMirrorElement>(".CodeMirror");
                if (codeMirrorInstance) {
                    codeMirrorInstance.CodeMirror.on("change", function (instance: CodeMirror.Editor) {
                        updatePropertyValue(editor!, propertyName, instance.getValue());
                    });
                }

                // Temporary, until https://github.com/froala/wysiwyg-editor/issues/3639 is fixed
                const froalaEditor = unwrapElement(this.$oel);
                const codeViewExitButton = froalaEditor!.querySelector(".fr-btn.html-switch");
                codeViewExitButton!.innerHTML = this.button.build("html");
            }
        },
    };

    return mergeWithCustomEvents(events, customOptions);
}

/**
 * Marges the default Froala event implementations for RTE with custom ones.
 * @param defaultEvents Default Froala event implementations of the RTE.
 * @param customOptions Custom Froala options.
 */
const mergeWithCustomEvents = (defaultEvents: Partial<FroalaEvents>, customOptions: Partial<FroalaOptions>) => {
    
    // Check if custom event implementations are defined
    if (typeof customOptions.events !== "object") {
        return defaultEvents;
    }

    // Make a copy of the events to keep the function pure...
    const events = { ...defaultEvents } as FroalaEventsOption;
    const customEvents = { ...customOptions.events } as FroalaEventsOption

    // Iterate over default events
    for (const eventName in events) {
        const customEvent = customEvents[eventName];

        // Check if same custom event implementation exists
        if (typeof customEvent === "function") {
            const defaultEvent = events[eventName];

            // Wrap the custom implementation call with the default first
            // Use regular function expression instead of arrow function, so that Froala can bind 'this' to the editor instance
            events[eventName] = function (this: FroalaEditor, ...args: any[]) {
                defaultEvent.call(this, ...args);
                customEvent.call(this, ...args);
            };

            // Delete the custom event once it's wrapped with the default implementation,
            // so that it doesn't overwrite itself during the merge...
            delete customEvents[eventName];
        }
    }

    // Merge the rest of the events which don't collide with the default's implementation
    return {
        ...events,
        ...customEvents
    };
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

const ensureFormComponentInitialization = (froalaEditor: FroalaEditor, formComponent: HTMLElement) => {
    // Ensure save button
    const saveButton = document.createElement("button");
    saveButton.textContent = window.kentico.localization.strings["Kentico.FormComponent.RichText.ApplyButton"];
    saveButton.classList.add("ktc-btn-rich-text-save");
    saveButton.addEventListener("click", () => {
        handleFullscreenExit(froalaEditor, formComponent);
        saveButton.remove();
    });

    // Ensure fullscreen mode
    document.body.classList.add("ktc-rich-text-form-component--fullscreen");
    document.body.appendChild(saveButton);
    froalaEditor.$iframe[0]!.style.height = "100%";
    try {
        // There's a known bug that fullscreen.toggle() throws an error
        // see https://github.com/froala/wysiwyg-editor/issues/3803  
        froalaEditor.fullscreen.toggle();
    } catch (error) {
        froalaEditor.events.focus();
    }
}

const handleFullscreenExit = (froalaEditor: FroalaEditor, formComponent: HTMLElement) => {
    const valueEl = formComponent.querySelector<HTMLInputElement>(`.${FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME}`);
    const editorValue = froalaEditor.codeView.isActive()
        ? froalaEditor.$wp.find<CodeMirrorElement>(".CodeMirror")[0].CodeMirror.getValue()
        : froalaEditor.html.get();
    valueEl!.value = replaceMacroElements(editorValue);
    valueEl?.dispatchEvent(new Event("change"));
    froalaEditor.fullscreen.toggle();
    froalaEditor.destroy();
    const richTextWrapper = froalaEditor.$oel[0];
    richTextWrapper.innerHTML = "";
    formComponent.querySelector("[data-inline-editor]")?.appendChild(richTextWrapper);
    document.body.classList.remove("ktc-rich-text-form-component--fullscreen");
}