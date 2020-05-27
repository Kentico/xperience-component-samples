import FroalaEditor from "froala-editor/js/froala_editor.pkgd.min";

import { CodeMirrorElement } from "../types";
import { replaceMacroElements } from "../plugins/macros/macro-services";
import { FORM_COMPONENT_VALUE_ELEMENT_CLASS_NAME } from "../constants";

const ANIMATION_LOCAL_STORAGE_KEY = "Kentico.FormComponents.RichText.SaveButtonAnimation";
const FULL_SCREEN_CLASS_NAME = "ktc-rich-text-form-component--fullscreen";
const SAVE_BUTTON_TEXT_RESOURCE_STRING = "Kentico.FormComponent.RichText.SaveButton";
const SAVE_BUTTON_SELECTOR = ".ktc-btn-rich-text-save";
const SAVE_BUTTON_ANIMATION_CLASS_NAME = "ktc-btn-slide";
const SAVE_BUTTON_ANIMATION_DURATION = 3000;
const SAVE_BUTTON_ANIMATION_DELAY = 100;

export class RichTextFormComponent {
    private readonly saveButtonText: string;

    public constructor(private readonly froalaEditor: FroalaEditor, private readonly formComponent: HTMLElement) {
        this.saveButtonText = window.kentico.localization.strings[SAVE_BUTTON_TEXT_RESOURCE_STRING];
    }

    public initialize() {
        this.ensureSaveButton();
        this.ensureFullscreen();
    }

    private ensureSaveButton() {
        let wrapper = document.createElement("div");
        wrapper.innerHTML = require("./templates/save-button.html")({
            buttonText: this.saveButtonText
        });
        wrapper = wrapper.firstChild as HTMLDivElement;
        wrapper.querySelector(SAVE_BUTTON_SELECTOR)?.addEventListener("click", () => {
            this.handleFullscreenExit();
            wrapper.remove();
        })
        document.body.appendChild(wrapper);

        // Ensure tooltip
        this.froalaEditor.tooltip.bind(this.froalaEditor.$sc, SAVE_BUTTON_SELECTOR);

        // Animate the button on first load
        this.ensureSaveButtonAnimation(wrapper);
    }

    private ensureFullscreen() {
        document.body.classList.add(FULL_SCREEN_CLASS_NAME);
        this.froalaEditor.fullscreen.toggle();
        // Set initial iframe height which ensures scrollbars if the content overflows the editor's size
        this.froalaEditor.$iframe[0]!.style.height = `${this.froalaEditor.el.clientHeight}px`;
        this.froalaEditor.events.focus();
    }

    private ensureSaveButtonAnimation(saveButton: HTMLElement) {
        if (!localStorage.getItem(ANIMATION_LOCAL_STORAGE_KEY)) {
            setTimeout(() => {
                saveButton.classList.add(SAVE_BUTTON_ANIMATION_CLASS_NAME);
            }, SAVE_BUTTON_ANIMATION_DELAY);
            setTimeout(() => {
                saveButton.classList.remove(SAVE_BUTTON_ANIMATION_CLASS_NAME);
            }, SAVE_BUTTON_ANIMATION_DURATION);
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