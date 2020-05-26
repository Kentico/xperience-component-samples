import { RichTextInitEventParams, FroalaOptionsModifier } from "../types";
import { initializeFroalaEditor } from "../froala";
import { getFormComponentOptions } from "./form-component-options";
import { FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME, RICH_TEXT_WRAPPER_SELECTOR } from "../constants";
import { getPreviewIframeHtml } from "./form-component-templates";
import { removeFullScreenMode } from "./options-modifier";

export const initializeRichTextFormComponent = (formComponent: HTMLElement, initializationData: RichTextInitEventParams) => {
    const editButton = formComponent.querySelector<HTMLButtonElement>(".ktc-btn");
    const valueEl = formComponent.querySelector<HTMLInputElement>(`.${FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME}`)!;

    editButton?.addEventListener("click", () => {
        const richTextEl = formComponent.querySelector(RICH_TEXT_WRAPPER_SELECTOR)!;
        richTextEl.classList.add("ktc-rich-text-form-component__froala");
        document.body.appendChild(richTextEl);
        initializeFroalaEditor(richTextEl, getFormComponentOptions(formComponent), valueEl.value, removeFullScreenMode);
    });

    valueEl.value = initializationData.html;
    valueEl.addEventListener("change", () => {
        const iframeEl = formComponent.querySelector<HTMLIFrameElement>("iframe")!;
        iframeEl.srcdoc = getPreviewIframeHtml(valueEl.value);

        if (valueEl.value === "") {
            formComponent.classList.add("ktc-rich-text-form-component--empty")
        } else {
            formComponent.classList.remove("ktc-rich-text-form-component--empty");
        }
    });
    valueEl.dispatchEvent(new Event("change"));
};
