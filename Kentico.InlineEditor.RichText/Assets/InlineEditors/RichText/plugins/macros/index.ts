import FroalaEditor, * as F from "froala-editor/js/froala_editor.pkgd.min";
import { insertMacroCommand, removeMacroCommand, configureMacroCommand } from "./macro-commands";

type Froala = typeof F;

const kenticoMacroPlugin = (editor: FroalaEditor): F.CustomPlugin => {
    // Create custom popup.
    function initPopup() {
        // Popup buttons.
        let popup_buttons = "";

        // Create the list of buttons.
        if (editor.opts.popupButtons.length > 1) {
            popup_buttons += "<div class=\"fr-buttons\">";
            popup_buttons += editor.button.buildList(editor.opts.popupButtons);
            popup_buttons += "</div>";
        }

        // Load popup template.
        const template = {
            buttons: popup_buttons,
        };

        // Create popup.
        var $popup = editor.popups.create("kenticoMacroPlugin.popup", template);

        return $popup;
    }

    // Show the popup
    function showPopup(macroEl: HTMLElement) {
        // Get the popup object defined above.
        let $popup = editor.popups.get("kenticoMacroPlugin.popup");

        // If popup doesn't exist then create it.
        // To improve performance it is best to create the popup when it is first needed
        // and not when the editor is initialized.
        if (!$popup) {
            $popup = initPopup();
        }

        // Set the editor toolbar as the popup's container.
        editor.popups.setContainer("kenticoMacroPlugin.popup", editor.$oel);

        // Compute the popup's position.
        const { top, left } = macroEl.getBoundingClientRect();
        const offsetLeft = left + macroEl.offsetWidth / 2;
        const offsetTop = top + window.pageYOffset;

        // Show the custom popup.
        // The button's outerHeight is required in case the popup needs to be displayed above it.
        editor.popups.show("kenticoMacroPlugin.popup", offsetLeft, offsetTop, macroEl.offsetHeight);

        macroEl.classList.add("ktc-macro-active");
    }

    // Hide the custom popup.
    function hidePopup() {
        editor.popups.hide("kenticoMacroPlugin.popup");

        const activeMacro = editor.el.querySelector(".ktc-macro-active");
        if (activeMacro) {
            activeMacro.classList.remove("ktc-macro-active");
        }
    }

    // Methods visible outside the plugin.
    return {
        showPopup,
        hidePopup,
    }
}

export const initializeMacroPlugin = (froala: Froala) => {
    // Define popup template.
    Object.assign(froala.POPUP_TEMPLATES, {
        "kenticoMacroPlugin.popup": "[_BUTTONS_]"
    });

    // Define popup buttons.
    Object.assign(F.DEFAULTS, {
        popupButtons: ["removeMacro", "configureMacro"],
    });

    froala.DefineIcon("insertMacro", {
        NAME: "plus",
        SVG_KEY: "add"
    });
    froala.RegisterCommand("insertMacro", insertMacroCommand);
    froala.RegisterCommand("removeMacro", removeMacroCommand);

    froala.DefineIcon("configureMacro", {
        NAME: "bullhorn",
        SVG_KEY: "cogs"
    });
    froala.RegisterCommand("configureMacro", configureMacroCommand);

    F.PLUGINS.kenticoMacroPlugin = kenticoMacroPlugin;
}
