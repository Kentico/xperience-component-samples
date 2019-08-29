import { MACRO_CLASS } from "./macro-constants";

export const getMacroEditModeElement = (): HTMLElement => {
    const macroElement = document.createElement("span");
    macroElement.setAttribute("contenteditable", "false");
    macroElement.classList.add("fr-deletable");
    macroElement.classList.add(MACRO_CLASS);
    macroElement.textContent = "Username";

    return macroElement;
}