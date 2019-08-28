import FroalaEditor, { RegisterCommandParameters } from "froala-editor/js/froala_editor.pkgd.min";

export const insertMacroCommand: RegisterCommandParameters = {
    title: 'Insert Dynamic Text',
    focus: true,
    undo: true,
    refreshAfterCallback: true,
    callback(this: FroalaEditor) {
        this.html.insert('<span contenteditable="false" class="fr-deletable ktc-macro">Username</span> ');
        this.undo.saveStep();

        this.toolbar.hide();
    }
}

export const removeMacroCommand: RegisterCommandParameters = {
    title: "Remove",
    icon: "remove",
    focus: false,
    undo: true,
    refreshAfterCallback: false,
    callback(this: FroalaEditor) {
        const macroEl = this.el.querySelector<HTMLElement>(".ktc-macro-active");
        if (macroEl) {
            macroEl.remove();
        }

        this.kenticoMacroPlugin.hidePopup();
    }
}

export const configureMacroCommand: RegisterCommandParameters = {
    title: "Configure",
    undo: false,
    focus: false,
    callback(this: FroalaEditor) {
        alert("popupButton2");
    }
}