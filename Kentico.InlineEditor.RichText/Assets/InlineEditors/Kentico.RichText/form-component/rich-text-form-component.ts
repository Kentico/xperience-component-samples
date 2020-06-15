import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { CodeMirrorElement } from "../types";
import { replaceMacroElements } from "../plugins/macros/macro-services";
import { FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME } from "../constants";

const ANIMATION_LOCAL_STORAGE_KEY = "Kentico.FormComponents.RichText.ApplyButtonAnimation";
const FULL_SCREEN_CLASS_NAME = "ktc-rich-text-form-component--fullscreen";
const APPLY_BUTTON_TEXT_RESOURCE_STRING = "Kentico.FormComponent.RichText.ApplyButton";
const APPLY_BUTTON_SELECTOR = ".ktc-btn-rich-text-apply";
const APPLY_BUTTON_ANIMATION_CLASS_NAME = "ktc-btn-slide";
const APPLY_BUTTON_ANIMATION_DURATION = 3000;
const APPLY_BUTTON_ANIMATION_DELAY = 300;

export class RichTextFormComponent {
    private readonly applyButtonText: string;

    public constructor(private readonly froalaEditor: FroalaEditor, private readonly formComponent: HTMLElement) {
        this.applyButtonText = window.kentico.localization.strings[APPLY_BUTTON_TEXT_RESOURCE_STRING];
    }

    public initialize() {
        this.ensureSaveButton();
        this.ensureFullscreen();
    }

    private ensureSaveButton() {
        const tempWrapper = document.createElement("div");
        tempWrapper.innerHTML = require("./templates/apply-button.html")({
            buttonText: this.applyButtonText
        });
        const applyButton = tempWrapper.firstChild as HTMLButtonElement;
        applyButton.addEventListener("click", () => {
            this.handleFullscreenExit();
            applyButton.remove();
        })
        document.body.appendChild(applyButton);

        // Ensure tooltip
        this.froalaEditor.tooltip.bind(this.froalaEditor.$sc, APPLY_BUTTON_SELECTOR);

        // Animate the button on first load
        this.ensureApplyButtonAnimation(applyButton);
    }

    private ensureFullscreen() {
        document.body.classList.add(FULL_SCREEN_CLASS_NAME);
        this.froalaEditor.fullscreen.toggle();
        this.froalaEditor.events.focus();
    }

    private ensureApplyButtonAnimation(applyButton: HTMLElement) {
        if (!localStorage.getItem(ANIMATION_LOCAL_STORAGE_KEY)) {
            setTimeout(() => {
                applyButton.classList.add(APPLY_BUTTON_ANIMATION_CLASS_NAME);
            }, APPLY_BUTTON_ANIMATION_DELAY);
            setTimeout(() => {
                applyButton.classList.remove(APPLY_BUTTON_ANIMATION_CLASS_NAME);
            }, APPLY_BUTTON_ANIMATION_DURATION);
            localStorage.setItem(ANIMATION_LOCAL_STORAGE_KEY, "1");
        }
    }

    private handleFullscreenExit() {
        const valueEl = this.formComponent.querySelector<HTMLInputElement>(`.${FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME}`);
        const editorValue = this.froalaEditor.codeView.isActive()
            ? this.froalaEditor.$wp.find<CodeMirrorElement>(".CodeMirror")[0].CodeMirror.getValue()
            : this.froalaEditor.html.get();
        valueEl!.value = replaceMacroElements(editorValue);
        valueEl?.dispatchEvent(new Event("change"));
        this.froalaEditor.fullscreen.toggle();
        this.froalaEditor.destroy();
        const richTextWrapper = this.froalaEditor.$oel[0];
        richTextWrapper.innerHTML = "";
        this.formComponent.querySelector("[data-inline-editor]")?.appendChild(richTextWrapper);
        document.body.classList.remove(FULL_SCREEN_CLASS_NAME);
    }
}