const TOOLBAR_SELECTOR = ".fr-toolbar";
const HIDDEN_CLASS_NAME = "ktc-hidden";

export const hideToolbar = () => {
    const toolbars = document.querySelectorAll<HTMLElement>(TOOLBAR_SELECTOR);
    toolbars.forEach((toolbar) => {
        if (isVisible(toolbar)) {
            toolbar.classList.add(HIDDEN_CLASS_NAME);
        }
    });
}

export const showToolbar = () => {
    const toolbars = document.querySelectorAll<HTMLElement>(TOOLBAR_SELECTOR);
    toolbars.forEach((toolbar) => {
        if (toolbar.classList.contains(HIDDEN_CLASS_NAME)) {
            toolbar.classList.remove(HIDDEN_CLASS_NAME);
        }
    });
}

const isVisible = (element: HTMLElement) => {
    return element !== null && element.offsetParent !== null;
}