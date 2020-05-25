import { RichTextInitEventParams } from "../types";
import { initializeFroalaEditor } from "../froala";
import { getFormComponentOptions } from "./form-component-options";
import { FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME } from "../constants";
import { getPreviewIframeHtml } from "./form-component-templates";

export const initializeRichTextFormComponent = (formComponent: HTMLElement, initializationData: RichTextInitEventParams) => {
    const editButton = formComponent.querySelector<HTMLButtonElement>(".ktc-btn");
    editButton?.addEventListener("click", () => {
        initializeFroalaEditor({ editor: formComponent }, getFormComponentOptions(formComponent), "FormComponent",);
    });

    const valueEl = document.querySelector<HTMLInputElement>(`.${FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME}`)!;
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
